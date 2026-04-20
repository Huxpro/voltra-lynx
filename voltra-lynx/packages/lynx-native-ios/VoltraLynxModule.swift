import Foundation
import Lynx

/// Voltra native module for Lynx iOS.
/// Conforms to LynxModule protocol and delegates to existing Voltra rendering code.
@objc
class VoltraLynxModule: NSObject, LynxModule {

    // MARK: - LynxModule Protocol

    static var name: String { "VoltraModule" }

    static var methodLookup: [String: String] {
        return [
            // Live Activity methods
            "startLiveActivity": NSStringFromSelector(#selector(startLiveActivity(_:options:callback:))),
            "updateLiveActivity": NSStringFromSelector(#selector(updateLiveActivity(_:jsonString:options:callback:))),
            "endLiveActivity": NSStringFromSelector(#selector(endLiveActivity(_:options:callback:))),
            "endAllLiveActivities": NSStringFromSelector(#selector(endAllLiveActivities(_:))),
            "getLatestVoltraActivityId": NSStringFromSelector(#selector(getLatestVoltraActivityId(_:))),
            "listVoltraActivityIds": NSStringFromSelector(#selector(listVoltraActivityIds(_:))),
            "isLiveActivityActive": NSStringFromSelector(#selector(isLiveActivityActive(_:callback:))),
            "isHeadless": NSStringFromSelector(#selector(isHeadless(_:))),
            "reloadLiveActivities": NSStringFromSelector(#selector(reloadLiveActivities(_:callback:))),

            // Widget methods
            "updateWidget": NSStringFromSelector(#selector(updateWidget(_:jsonString:options:callback:))),
            "scheduleWidget": NSStringFromSelector(#selector(scheduleWidget(_:timelineJson:callback:))),
            "reloadWidgets": NSStringFromSelector(#selector(reloadWidgets(_:callback:))),
            "clearWidget": NSStringFromSelector(#selector(clearWidget(_:callback:))),
            "clearAllWidgets": NSStringFromSelector(#selector(clearAllWidgets(_:))),
            "getActiveWidgets": NSStringFromSelector(#selector(getActiveWidgets(_:))),
            "setWidgetServerCredentials": NSStringFromSelector(#selector(setWidgetServerCredentials(_:callback:))),
            "clearWidgetServerCredentials": NSStringFromSelector(#selector(clearWidgetServerCredentials(_:))),

            // Image preloading
            "preloadImages": NSStringFromSelector(#selector(preloadImages(_:callback:))),
            "clearPreloadedImages": NSStringFromSelector(#selector(clearPreloadedImages(_:callback:))),
        ]
    }

    private weak var lynxContext: LynxContext?

    required init(context: LynxContext) {
        self.lynxContext = context
        super.init()
    }

    // MARK: - Live Activity Methods (Stubs)

    @objc func startLiveActivity(_ jsonString: String, options: NSDictionary?, callback: @escaping (Any?) -> Void) {
        NSLog("[VoltraLynxModule] startLiveActivity called with payload length: \(jsonString.count)")
        // TODO: Integrate with existing Voltra ActivityKit code
        callback("stub-activity-id")
    }

    @objc func updateLiveActivity(_ activityId: String, jsonString: String, options: NSDictionary?, callback: @escaping (Any?) -> Void) {
        NSLog("[VoltraLynxModule] updateLiveActivity called for: \(activityId)")
        callback(nil)
    }

    @objc func endLiveActivity(_ activityId: String, options: NSDictionary?, callback: @escaping (Any?) -> Void) {
        NSLog("[VoltraLynxModule] endLiveActivity called for: \(activityId)")
        callback(nil)
    }

    @objc func endAllLiveActivities(_ callback: @escaping (Any?) -> Void) {
        NSLog("[VoltraLynxModule] endAllLiveActivities called")
        callback(nil)
    }

    @objc func getLatestVoltraActivityId(_ callback: @escaping (Any?) -> Void) {
        NSLog("[VoltraLynxModule] getLatestVoltraActivityId called")
        callback(nil)
    }

    @objc func listVoltraActivityIds(_ callback: @escaping (Any?) -> Void) {
        NSLog("[VoltraLynxModule] listVoltraActivityIds called")
        callback([String]())
    }

    @objc func isLiveActivityActive(_ activityName: String, callback: @escaping (Any?) -> Void) {
        NSLog("[VoltraLynxModule] isLiveActivityActive called for: \(activityName)")
        callback(false)
    }

    @objc func isHeadless(_ callback: @escaping (Any?) -> Void) {
        NSLog("[VoltraLynxModule] isHeadless called")
        callback(false)
    }

    @objc func reloadLiveActivities(_ activityNames: NSArray?, callback: @escaping (Any?) -> Void) {
        NSLog("[VoltraLynxModule] reloadLiveActivities called")
        callback(nil)
    }

    // MARK: - Widget Methods (Stubs)

    @objc func updateWidget(_ widgetId: String, jsonString: String, options: NSDictionary?, callback: @escaping (Any?) -> Void) {
        NSLog("[VoltraLynxModule] updateWidget called for: \(widgetId)")
        callback(nil)
    }

    @objc func scheduleWidget(_ widgetId: String, timelineJson: String, callback: @escaping (Any?) -> Void) {
        NSLog("[VoltraLynxModule] scheduleWidget called for: \(widgetId)")
        callback(nil)
    }

    @objc func reloadWidgets(_ widgetIds: NSArray?, callback: @escaping (Any?) -> Void) {
        NSLog("[VoltraLynxModule] reloadWidgets called")
        callback(nil)
    }

    @objc func clearWidget(_ widgetId: String, callback: @escaping (Any?) -> Void) {
        NSLog("[VoltraLynxModule] clearWidget called for: \(widgetId)")
        callback(nil)
    }

    @objc func clearAllWidgets(_ callback: @escaping (Any?) -> Void) {
        NSLog("[VoltraLynxModule] clearAllWidgets called")
        callback(nil)
    }

    @objc func getActiveWidgets(_ callback: @escaping (Any?) -> Void) {
        NSLog("[VoltraLynxModule] getActiveWidgets called")
        callback([Any]())
    }

    @objc func setWidgetServerCredentials(_ credentials: NSDictionary, callback: @escaping (Any?) -> Void) {
        NSLog("[VoltraLynxModule] setWidgetServerCredentials called")
        callback(nil)
    }

    @objc func clearWidgetServerCredentials(_ callback: @escaping (Any?) -> Void) {
        NSLog("[VoltraLynxModule] clearWidgetServerCredentials called")
        callback(nil)
    }

    // MARK: - Image Preloading (Stubs)

    @objc func preloadImages(_ images: NSArray, callback: @escaping (Any?) -> Void) {
        NSLog("[VoltraLynxModule] preloadImages called with \(images.count) images")
        callback(["succeeded": [String](), "failed": [Any]()] as NSDictionary)
    }

    @objc func clearPreloadedImages(_ keys: NSArray?, callback: @escaping (Any?) -> Void) {
        NSLog("[VoltraLynxModule] clearPreloadedImages called")
        callback(nil)
    }

    // MARK: - Events

    func sendEvent(_ name: String, data: Any?) {
        lynxContext?.sendGlobalEvent("voltra:\(name)", withParams: data)
    }
}
