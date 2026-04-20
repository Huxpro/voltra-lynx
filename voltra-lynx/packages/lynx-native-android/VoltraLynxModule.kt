package com.voltra.lynx

import android.content.Context
import com.lynx.core.LynxEnv
import com.lynx.core.base.LynxModule
import com.lynx.core.base.LynxMethod
import com.lynx.core.base.Callback
import org.json.JSONArray
import org.json.JSONObject

/**
 * Voltra native module for Lynx Android.
 * Delegates to existing VoltraModuleImpl for all business logic.
 */
class VoltraLynxModule(context: Context) : LynxModule(context) {

    private val impl = VoltraModuleImpl(context)

    companion object {
        fun register() {
            LynxEnv.inst().registerModule("VoltraModule", VoltraLynxModule::class.java)
        }
    }

    // ─── Live Update Methods (US-019) ─────────────────────────────

    @LynxMethod
    fun startAndroidLiveUpdate(payload: String, options: JSONObject, callback: Callback) {
        impl.startAndroidLiveUpdate(payload, options) { result ->
            callback.invoke(result)
        }
    }

    @LynxMethod
    fun updateAndroidLiveUpdate(notificationId: String, payload: String, callback: Callback) {
        impl.updateAndroidLiveUpdate(notificationId, payload) { result ->
            callback.invoke(result)
        }
    }

    @LynxMethod
    fun stopAndroidLiveUpdate(notificationId: String, callback: Callback) {
        impl.stopAndroidLiveUpdate(notificationId) { result ->
            callback.invoke(result)
        }
    }

    @LynxMethod
    fun isAndroidLiveUpdateActive(updateName: String, callback: Callback) {
        callback.invoke(impl.isAndroidLiveUpdateActive(updateName))
    }

    @LynxMethod
    fun endAllAndroidLiveUpdates(callback: Callback) {
        impl.endAllAndroidLiveUpdates { callback.invoke(null) }
    }

    // ─── Ongoing Notification Methods (US-019) ────────────────────

    @LynxMethod
    fun startAndroidOngoingNotification(payload: String, options: JSONObject, callback: Callback) {
        impl.startAndroidOngoingNotification(payload, options) { result ->
            callback.invoke(result)
        }
    }

    @LynxMethod
    fun upsertAndroidOngoingNotification(payload: String, options: JSONObject, callback: Callback) {
        impl.upsertAndroidOngoingNotification(payload, options) { result ->
            callback.invoke(result)
        }
    }

    @LynxMethod
    fun updateAndroidOngoingNotification(notificationId: String, payload: String, options: JSONObject?, callback: Callback) {
        impl.updateAndroidOngoingNotification(notificationId, payload, options) { result ->
            callback.invoke(result)
        }
    }

    @LynxMethod
    fun stopAndroidOngoingNotification(notificationId: String, callback: Callback) {
        impl.stopAndroidOngoingNotification(notificationId) { result ->
            callback.invoke(result)
        }
    }

    @LynxMethod
    fun isAndroidOngoingNotificationActive(notificationId: String, callback: Callback) {
        callback.invoke(impl.isAndroidOngoingNotificationActive(notificationId))
    }

    @LynxMethod
    fun getAndroidOngoingNotificationStatus(notificationId: String, callback: Callback) {
        callback.invoke(impl.getAndroidOngoingNotificationStatus(notificationId))
    }

    @LynxMethod
    fun endAllAndroidOngoingNotifications(callback: Callback) {
        impl.endAllAndroidOngoingNotifications { callback.invoke(null) }
    }

    @LynxMethod
    fun canPostPromotedAndroidNotifications(callback: Callback) {
        callback.invoke(impl.canPostPromotedAndroidNotifications())
    }

    @LynxMethod
    fun getAndroidOngoingNotificationCapabilities(callback: Callback) {
        callback.invoke(impl.getAndroidOngoingNotificationCapabilities())
    }

    @LynxMethod
    fun openAndroidNotificationSettings(callback: Callback) {
        impl.openAndroidNotificationSettings()
        callback.invoke(null)
    }

    // ─── Widget Methods (US-018) ──────────────────────────────────

    @LynxMethod
    fun updateAndroidWidget(widgetId: String, jsonString: String, options: JSONObject?, callback: Callback) {
        impl.updateAndroidWidget(widgetId, jsonString, options) { result ->
            callback.invoke(result)
        }
    }

    @LynxMethod
    fun reloadAndroidWidgets(widgetIds: JSONArray?, callback: Callback) {
        impl.reloadAndroidWidgets(widgetIds) { callback.invoke(null) }
    }

    @LynxMethod
    fun clearAndroidWidget(widgetId: String, callback: Callback) {
        impl.clearAndroidWidget(widgetId) { callback.invoke(null) }
    }

    @LynxMethod
    fun clearAllAndroidWidgets(callback: Callback) {
        impl.clearAllAndroidWidgets { callback.invoke(null) }
    }

    @LynxMethod
    fun requestPinGlanceAppWidget(widgetId: String, options: JSONObject?, callback: Callback) {
        impl.requestPinGlanceAppWidget(widgetId, options) { result ->
            callback.invoke(result)
        }
    }

    // ─── Image Preloading & Utilities (US-020) ────────────────────

    @LynxMethod
    fun preloadImages(images: JSONArray, callback: Callback) {
        impl.preloadImages(images) { result ->
            callback.invoke(result)
        }
    }

    @LynxMethod
    fun clearPreloadedImages(keys: JSONArray?, callback: Callback) {
        impl.clearPreloadedImages(keys) { callback.invoke(null) }
    }

    @LynxMethod
    fun setWidgetServerCredentials(credentials: JSONObject, callback: Callback) {
        impl.setWidgetServerCredentials(credentials) { callback.invoke(null) }
    }

    @LynxMethod
    fun clearWidgetServerCredentials(callback: Callback) {
        impl.clearWidgetServerCredentials { callback.invoke(null) }
    }

    @LynxMethod
    fun getActiveWidgets(callback: Callback) {
        impl.getActiveWidgets { result ->
            callback.invoke(result)
        }
    }

    // ─── Events (US-020) ──────────────────────────────────────────

    private fun sendEvent(name: String, data: Any?) {
        lynxContext?.sendGlobalEvent("voltra:$name", data)
    }
}
