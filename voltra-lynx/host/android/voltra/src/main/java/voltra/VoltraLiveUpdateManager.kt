package voltra

import android.app.Notification
import android.app.NotificationManager
import android.content.Context
import android.util.Log
import voltra.glance.RemoteViewsGenerator
import voltra.parsing.VoltraPayloadParser

/**
 * Manages Android Live Update notifications.
 *
 * Live Updates on Android are rendered as notification-bar notifications
 * using RemoteViews generated from Voltra payloads (collapsed + expanded views).
 */
class VoltraLiveUpdateManager(
    private val context: Context,
) {
    companion object {
        private const val TAG = "VoltraLiveUpdateMgr"
        private const val PREFS_NAME = "voltra_live_updates"
        private const val KEY_ACTIVE = "active_updates"
        private const val NOTIFICATION_ID_BASE = 20000
    }

    private val nm = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    private val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    // In-memory tracking: updateName/id → Android notification int ID
    private val activeUpdates = mutableMapOf<String, Int>()
    private var nextId = NOTIFICATION_ID_BASE

    init {
        // Restore persisted active IDs
        val saved = prefs.getStringSet(KEY_ACTIVE, emptySet()) ?: emptySet()
        saved.forEachIndexed { index, name ->
            activeUpdates[name] = NOTIFICATION_ID_BASE + index
        }
        nextId = NOTIFICATION_ID_BASE + saved.size
    }

    /**
     * Start a live update notification.
     * Parses the Voltra payload, generates collapsed/expanded RemoteViews,
     * and posts the notification.
     */
    suspend fun start(payload: String, updateName: String?, channelId: String): String {
        val id = updateName ?: "live_update_${System.currentTimeMillis()}"
        val notifId = nextId++
        activeUpdates[id] = notifId
        persistActiveIds()

        postNotification(id, notifId, payload, channelId)
        Log.d(TAG, "Started live update: $id (notifId=$notifId)")
        return id
    }

    /**
     * Update an existing live update notification with new payload.
     */
    suspend fun update(notificationId: String, payload: String) {
        val notifId = activeUpdates[notificationId]
        if (notifId == null) {
            Log.w(TAG, "update: no active live update with id=$notificationId")
            return
        }

        // Look up the channel from the existing notification
        val channelId = nm.activeNotifications
            .firstOrNull { it.id == notifId }
            ?.notification?.channelId
            ?: "voltra_live_updates"

        postNotification(notificationId, notifId, payload, channelId)
        Log.d(TAG, "Updated live update: $notificationId")
    }

    /**
     * Stop and dismiss a live update notification.
     */
    fun stop(notificationId: String) {
        val notifId = activeUpdates.remove(notificationId)
        if (notifId != null) {
            nm.cancel(notifId)
            persistActiveIds()
            Log.d(TAG, "Stopped live update: $notificationId")
        }
    }

    /**
     * Check if a live update is currently active.
     */
    fun isActive(updateName: String): Boolean {
        return activeUpdates.containsKey(updateName)
    }

    /**
     * End all active live update notifications.
     */
    fun endAll() {
        activeUpdates.values.forEach { notifId -> nm.cancel(notifId) }
        activeUpdates.clear()
        persistActiveIds()
        Log.d(TAG, "Ended all live updates")
    }

    private suspend fun postNotification(id: String, notifId: Int, payload: String, channelId: String) {
        val parsedPayload = VoltraPayloadParser.parse(payload)

        // Generate collapsed and expanded RemoteViews from the Voltra payload
        val collapsed = RemoteViewsGenerator.generateCollapsed(context, parsedPayload)
        val expanded = RemoteViewsGenerator.generateExpanded(context, parsedPayload)

        val builder = Notification.Builder(context, channelId)
            .setSmallIcon(android.R.drawable.ic_popup_reminder)
            .setOngoing(true)
            .setAutoCancel(false)

        if (collapsed != null) {
            builder.setCustomContentView(collapsed)
        }
        if (expanded != null) {
            builder.setCustomBigContentView(expanded)
        }
        // If no custom views were generated, set a fallback text
        if (collapsed == null && expanded == null) {
            builder.setContentTitle("Live Update")
            builder.setContentText("Update active: $id")
        }

        nm.notify(notifId, builder.build())
    }

    private fun persistActiveIds() {
        prefs.edit()
            .putStringSet(KEY_ACTIVE, activeUpdates.keys.toSet())
            .apply()
    }
}
