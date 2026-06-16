package voltra

import android.app.NotificationChannel
import android.app.NotificationManager
import android.appwidget.AppWidgetManager
import android.content.Context
import android.util.Log
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import androidx.glance.appwidget.GlanceAppWidgetManager
import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule
import com.lynx.react.bridge.Callback
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import voltra.events.VoltraEventBus
import voltra.images.VoltraImageManager
import voltra.widget.VoltraGlanceWidget
import voltra.widget.VoltraWidgetManager

/**
 * Voltra native module for Lynx Android.
 *
 * Translates Lynx's callback-based NativeModule protocol to the existing
 * Voltra rendering engine (Glance widgets, notifications, image preloading).
 *
 * Async methods accept [Callback] as the last parameter.
 * Sync methods return values directly (Lynx infers sync from lack of Callback param).
 *
 * Registered as "VoltraModule" via LynxEnv.inst().registerModule().
 */
class VoltraLynxModule(context: Context) : LynxModule(context) {

    companion object {
        private const val TAG = "VoltraLynxModule"
        private const val DEFAULT_LIVE_UPDATE_CHANNEL = "voltra_live_updates"
        private const val DEFAULT_ONGOING_CHANNEL = "voltra_ongoing"
    }

    private val appContext: Context
        get() = mContext.applicationContext

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    private val notificationManager by lazy {
        VoltraNotificationManager(appContext)
    }

    private val widgetManager by lazy {
        VoltraWidgetManager(appContext)
    }

    private val imageManager by lazy {
        VoltraImageManager(appContext)
    }

    private val eventBus by lazy {
        VoltraEventBus.getInstance(appContext)
    }

    private val liveUpdateManager by lazy {
        VoltraLiveUpdateManager(appContext)
    }

    private var eventBusUnsubscribe: (() -> Unit)? = null

    init {
        ensureNotificationChannels()
    }

    override fun destroy() {
        eventBusUnsubscribe?.invoke()
        eventBusUnsubscribe = null
        scope.cancel()
    }

    /**
     * Create default notification channels required by Android 8.0+.
     * Without a valid channel, notifications are silently dropped.
     */
    private fun ensureNotificationChannels() {
        val nm = appContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        val liveUpdateChannel = NotificationChannel(
            DEFAULT_LIVE_UPDATE_CHANNEL,
            "Live Updates",
            NotificationManager.IMPORTANCE_HIGH,
        ).apply {
            description = "Real-time update notifications"
            setShowBadge(false)
        }
        nm.createNotificationChannel(liveUpdateChannel)

        val ongoingChannel = NotificationChannel(
            DEFAULT_ONGOING_CHANNEL,
            "Ongoing",
            NotificationManager.IMPORTANCE_LOW,
        ).apply {
            description = "Ongoing background notifications"
            setShowBadge(false)
        }
        nm.createNotificationChannel(ongoingChannel)
    }

    // ──────────────────────────────────────────────────────────────
    // Android Widget APIs
    // ──────────────────────────────────────────────────────────────

    @LynxMethod
    fun updateAndroidWidget(widgetId: String, jsonString: String, options: Map<String, Any?>?, callback: Callback) {
        Log.d(TAG, "updateAndroidWidget called with widgetId=$widgetId")
        val deepLinkUrl = options?.get("deepLinkUrl") as? String
        widgetManager.writeWidgetData(widgetId, jsonString, deepLinkUrl)
        scope.launch {
            widgetManager.updateWidget(widgetId)
            callback.invoke(null as Any?)
        }
    }

    @LynxMethod
    fun reloadAndroidWidgets(widgetIds: ArrayList<String>?, callback: Callback) {
        Log.d(TAG, "reloadAndroidWidgets called with widgetIds=$widgetIds")
        scope.launch {
            widgetManager.reloadWidgets(widgetIds)
            callback.invoke(null as Any?)
        }
    }

    @LynxMethod
    fun clearAndroidWidget(widgetId: String, callback: Callback) {
        Log.d(TAG, "clearAndroidWidget called with widgetId=$widgetId")
        widgetManager.clearWidgetData(widgetId)
        scope.launch {
            widgetManager.updateWidget(widgetId)
            callback.invoke(null as Any?)
        }
    }

    @LynxMethod
    fun clearAllAndroidWidgets(callback: Callback) {
        Log.d(TAG, "clearAllAndroidWidgets called")
        widgetManager.clearAllWidgetData()
        scope.launch {
            widgetManager.reloadAllWidgets()
            callback.invoke(null as Any?)
        }
    }

    @LynxMethod
    fun getActiveWidgets(callback: Callback) {
        val context = appContext
        val manager = AppWidgetManager.getInstance(context)
        val packageName = context.packageName

        val installedProviders = manager.installedProviders.filter {
            it.provider.packageName == packageName
        }

        val activeWidgets = mutableListOf<Map<String, Any>>()
        for (providerInfo in installedProviders) {
            val ids = manager.getAppWidgetIds(providerInfo.provider)
            for (id in ids) {
                val opts = manager.getAppWidgetOptions(id)
                val minWidth = opts.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH)
                val minHeight = opts.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT)

                val shortClassName = providerInfo.provider.shortClassName
                val prefix = ".widget.VoltraWidget_"
                val suffix = "Receiver"
                val name = if (shortClassName.startsWith(prefix) && shortClassName.endsWith(suffix)) {
                    shortClassName.substring(prefix.length, shortClassName.length - suffix.length)
                } else {
                    shortClassName
                }

                activeWidgets.add(
                    mapOf(
                        "name" to name,
                        "widgetId" to id,
                        "providerClassName" to shortClassName,
                        "label" to providerInfo.loadLabel(context.packageManager).toString(),
                        "width" to minWidth,
                        "height" to minHeight,
                    ),
                )
            }
        }

        callback.invoke(activeWidgets)
    }

    @LynxMethod
    fun requestPinGlanceAppWidget(widgetId: String, options: Map<String, Any?>?, callback: Callback) {
        Log.d(TAG, "requestPinGlanceAppWidget called with widgetId=$widgetId")
        val context = appContext

        val receiverClassName = "${context.packageName}.widget.VoltraWidget_${widgetId}Receiver"

        val receiverClass = try {
            @Suppress("UNCHECKED_CAST")
            Class.forName(receiverClassName) as Class<out androidx.glance.appwidget.GlanceAppWidgetReceiver>
        } catch (e: ClassNotFoundException) {
            Log.e(TAG, "Widget receiver class not found: $receiverClassName", e)
            callback.invoke(false)
            return
        }

        val glanceManager = GlanceAppWidgetManager(context)
        val previewSize = if (options != null) {
            val width = (options["previewWidth"] as? Number)?.toFloat()
            val height = (options["previewHeight"] as? Number)?.toFloat()
            if (width != null && height != null) DpSize(width.dp, height.dp) else null
        } else {
            null
        }

        scope.launch {
            val result = if (previewSize != null) {
                val previewWidget = VoltraGlanceWidget(widgetId)
                glanceManager.requestPinGlanceAppWidget(
                    receiver = receiverClass,
                    preview = previewWidget,
                    previewState = previewSize,
                )
            } else {
                glanceManager.requestPinGlanceAppWidget(receiverClass)
            }
            callback.invoke(result)
        }
    }

    // ──────────────────────────────────────────────────────────────
    // Widget Server Credentials APIs
    // ──────────────────────────────────────────────────────────────

    @LynxMethod
    fun setWidgetServerCredentials(credentials: Map<String, Any?>, callback: Callback) {
        Log.d(TAG, "setWidgetServerCredentials called")
        val context = appContext
        val token = credentials["token"] as? String
            ?: run {
                Log.e(TAG, "setWidgetServerCredentials: token is required")
                callback.invoke(null as Any?)
                return
            }

        @Suppress("UNCHECKED_CAST")
        val headers = credentials["headers"] as? Map<String, String>

        scope.launch {
            voltra.widget.VoltraWidgetCredentialStore.saveToken(context, token)
            if (headers != null && headers.isNotEmpty()) {
                voltra.widget.VoltraWidgetCredentialStore.saveHeaders(context, headers)
            }
            val wm = voltra.widget.VoltraWidgetManager(context)
            wm.reloadAllWidgets()
            callback.invoke(null as Any?)
        }
    }

    @LynxMethod
    fun clearWidgetServerCredentials(callback: Callback) {
        Log.d(TAG, "clearWidgetServerCredentials called")
        val context = appContext
        scope.launch {
            voltra.widget.VoltraWidgetCredentialStore.clearAll(context)
            val wm = voltra.widget.VoltraWidgetManager(context)
            wm.reloadAllWidgets()
            callback.invoke(null as Any?)
        }
    }

    // ──────────────────────────────────────────────────────────────
    // Android Live Update (Notification) APIs
    // ──────────────────────────────────────────────────────────────

    @LynxMethod
    fun startAndroidLiveUpdate(payload: String, options: Map<String, Any?>?, callback: Callback) {
        Log.d(TAG, "startAndroidLiveUpdate called")
        val updateName = options?.get("updateName") as? String
        val channelId = options?.get("channelId") as? String ?: DEFAULT_LIVE_UPDATE_CHANNEL

        // Ensure the custom channel exists if not using default
        if (channelId != DEFAULT_LIVE_UPDATE_CHANNEL) {
            val nm = appContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            if (nm.getNotificationChannel(channelId) == null) {
                nm.createNotificationChannel(
                    NotificationChannel(channelId, channelId, NotificationManager.IMPORTANCE_HIGH),
                )
            }
        }

        scope.launch {
            val notificationId = liveUpdateManager.start(payload, updateName, channelId)
            callback.invoke(notificationId)
        }
    }

    @LynxMethod
    fun updateAndroidLiveUpdate(notificationId: String, payload: String, callback: Callback) {
        Log.d(TAG, "updateAndroidLiveUpdate called with notificationId=$notificationId")
        scope.launch {
            liveUpdateManager.update(notificationId, payload)
            callback.invoke(null as Any?)
        }
    }

    @LynxMethod
    fun stopAndroidLiveUpdate(notificationId: String, callback: Callback) {
        Log.d(TAG, "stopAndroidLiveUpdate called with notificationId=$notificationId")
        liveUpdateManager.stop(notificationId)
        callback.invoke(null as Any?)
    }

    @LynxMethod
    fun isAndroidLiveUpdateActive(updateName: String): Boolean {
        return liveUpdateManager.isActive(updateName)
    }

    @LynxMethod
    fun endAllAndroidLiveUpdates(callback: Callback) {
        Log.d(TAG, "endAllAndroidLiveUpdates called")
        liveUpdateManager.endAll()
        callback.invoke(null as Any?)
    }

    // ──────────────────────────────────────────────────────────────
    // Android Ongoing Notification APIs
    // ──────────────────────────────────────────────────────────────

    @LynxMethod
    fun startAndroidOngoingNotification(payload: String, options: Map<String, Any?>, callback: Callback) {
        Log.d(TAG, "startAndroidOngoingNotification called")

        // Ensure the channel exists
        val channelId = options["channelId"] as? String ?: DEFAULT_ONGOING_CHANNEL
        ensureCustomChannel(channelId)

        val ongoingOptions = AndroidOngoingNotificationOptions(
            notificationId = options["notificationId"] as? String,
            channelId = channelId,
            smallIcon = options["smallIcon"] as? String,
            deepLinkUrl = options["deepLinkUrl"] as? String,
            requestPromotedOngoing = options["requestPromotedOngoing"] as? Boolean,
            fallbackBehavior = options["fallbackBehavior"] as? String,
        )

        scope.launch {
            val result = notificationManager.startOngoingNotification(payload, ongoingOptions)
            callback.invoke(
                mapOf(
                    "ok" to result.ok,
                    "notificationId" to result.notificationId,
                    "action" to result.action,
                    "reason" to result.reason,
                ),
            )
        }
    }

    @LynxMethod
    fun upsertAndroidOngoingNotification(payload: String, options: Map<String, Any?>, callback: Callback) {
        Log.d(TAG, "upsertAndroidOngoingNotification called")

        val channelId = options["channelId"] as? String ?: DEFAULT_ONGOING_CHANNEL
        ensureCustomChannel(channelId)

        val ongoingOptions = AndroidOngoingNotificationOptions(
            notificationId = options["notificationId"] as? String,
            channelId = channelId,
            smallIcon = options["smallIcon"] as? String,
            deepLinkUrl = options["deepLinkUrl"] as? String,
            requestPromotedOngoing = options["requestPromotedOngoing"] as? Boolean,
            fallbackBehavior = options["fallbackBehavior"] as? String,
        )

        scope.launch {
            val result = notificationManager.upsertOngoingNotification(payload, ongoingOptions)
            callback.invoke(
                mapOf(
                    "ok" to result.ok,
                    "notificationId" to result.notificationId,
                    "action" to result.action,
                    "reason" to result.reason,
                ),
            )
        }
    }

    @LynxMethod
    fun updateAndroidOngoingNotification(
        notificationId: String,
        payload: String,
        options: Map<String, Any?>?,
        callback: Callback,
    ) {
        Log.d(TAG, "updateAndroidOngoingNotification called with notificationId=$notificationId")

        val ongoingOptions = AndroidOngoingNotificationOptions(
            channelId = options?.get("channelId") as? String,
            smallIcon = options?.get("smallIcon") as? String,
            deepLinkUrl = options?.get("deepLinkUrl") as? String,
            requestPromotedOngoing = options?.get("requestPromotedOngoing") as? Boolean,
            fallbackBehavior = options?.get("fallbackBehavior") as? String,
        )

        scope.launch {
            val result = notificationManager.updateOngoingNotification(notificationId, payload, ongoingOptions)
            callback.invoke(
                mapOf(
                    "ok" to result.ok,
                    "notificationId" to result.notificationId,
                    "action" to result.action,
                    "reason" to result.reason,
                ),
            )
        }
    }

    @LynxMethod
    fun stopAndroidOngoingNotification(notificationId: String, callback: Callback) {
        Log.d(TAG, "stopAndroidOngoingNotification called with notificationId=$notificationId")
        val result = notificationManager.stopOngoingNotification(notificationId)
        callback.invoke(
            mapOf(
                "ok" to result.ok,
                "notificationId" to result.notificationId,
                "action" to result.action,
                "reason" to result.reason,
            ),
        )
    }

    @LynxMethod
    fun isAndroidOngoingNotificationActive(notificationId: String): Boolean {
        return notificationManager.isOngoingNotificationActive(notificationId)
    }

    @LynxMethod
    fun getAndroidOngoingNotificationStatus(notificationId: String): Map<String, Any?> {
        val status = notificationManager.getOngoingNotificationStatus(notificationId)
        return mapOf(
            "isActive" to status.isActive,
            "isDismissed" to status.isDismissed,
            "isPromoted" to status.isPromoted,
            "hasPromotableCharacteristics" to status.hasPromotableCharacteristics,
        )
    }

    @LynxMethod
    fun endAllAndroidOngoingNotifications(callback: Callback) {
        notificationManager.endAllOngoingNotifications()
        callback.invoke(null as Any?)
    }

    @LynxMethod
    fun canPostPromotedAndroidNotifications(): Boolean {
        return notificationManager.canPostPromotedAndroidNotifications()
    }

    @LynxMethod
    fun getAndroidOngoingNotificationCapabilities(): Map<String, Any> {
        val capabilities = notificationManager.getOngoingNotificationCapabilities()
        return mapOf(
            "apiLevel" to capabilities.apiLevel,
            "notificationsEnabled" to capabilities.notificationsEnabled,
            "supportsPromotedNotifications" to capabilities.supportsPromotedNotifications,
            "canPostPromotedNotifications" to capabilities.canPostPromotedNotifications,
            "canRequestPromotedOngoing" to capabilities.canRequestPromotedOngoing,
        )
    }

    @LynxMethod
    fun openAndroidNotificationSettings(callback: Callback) {
        notificationManager.openPromotedNotificationSettings()
        callback.invoke(null as Any?)
    }

    // ──────────────────────────────────────────────────────────────
    // Image Preloading APIs
    // ──────────────────────────────────────────────────────────────

    @LynxMethod
    fun preloadImages(images: List<Map<String, Any>>, callback: Callback) {
        Log.d(TAG, "preloadImages called with ${images.size} images")

        scope.launch {
            val results = images.map { img ->
                async {
                    val url = img["url"] as String
                    val key = img["key"] as String
                    val method = (img["method"] as? String) ?: "GET"

                    @Suppress("UNCHECKED_CAST")
                    val headers = img["headers"] as? Map<String, String>

                    val resultKey = imageManager.preloadImage(url, key, method, headers)
                    if (resultKey != null) Pair(key, null) else Pair(key, "Failed to download image")
                }
            }.awaitAll()

            val succeeded = results.filter { it.second == null }.map { it.first }
            val failed = results.filter { it.second != null }.map {
                mapOf("key" to it.first, "error" to it.second)
            }

            callback.invoke(mapOf("succeeded" to succeeded, "failed" to failed))
        }
    }

    @LynxMethod
    fun clearPreloadedImages(keys: List<String>?, callback: Callback) {
        Log.d(TAG, "clearPreloadedImages called with keys=$keys")
        imageManager.clearPreloadedImages(keys)
        callback.invoke(null as Any?)
    }

    // ──────────────────────────────────────────────────────────────
    // Event Listener API
    // ──────────────────────────────────────────────────────────────

    @LynxMethod
    fun addListener(event: String, callback: Callback) {
        Log.d(TAG, "addListener called for event=$event")

        // Subscribe to VoltraEventBus and forward matching events to JS callback
        if (eventBusUnsubscribe == null) {
            // First listener — replay persisted events and start hot subscription
            val persistedEvents = eventBus.popAll()
            persistedEvents.forEach { voltraEvent ->
                callback.invoke(voltraEvent.toMap())
            }

            eventBusUnsubscribe = eventBus.addListener { voltraEvent ->
                callback.invoke(voltraEvent.toMap())
            }
        }
    }

    // ──────────────────────────────────────────────────────────────
    // Helpers
    // ──────────────────────────────────────────────────────────────

    private fun ensureCustomChannel(channelId: String) {
        if (channelId == DEFAULT_LIVE_UPDATE_CHANNEL || channelId == DEFAULT_ONGOING_CHANNEL) return
        val nm = appContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        if (nm.getNotificationChannel(channelId) == null) {
            nm.createNotificationChannel(
                NotificationChannel(channelId, channelId, NotificationManager.IMPORTANCE_DEFAULT),
            )
        }
    }
}
