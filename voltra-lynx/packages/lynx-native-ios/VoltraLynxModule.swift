import ActivityKit
import Foundation
import Lynx
import os

/// Voltra native module for Lynx iOS.
/// Conforms to LynxModule and delegates to VoltraModuleImpl (shared with Expo version).
@objc
class VoltraLynxModule: NSObject, LynxModule {

    // MARK: - LynxModule Protocol

    static var name: String { "VoltraModule" }

    static var methodLookup: [String: String] {
        return [
            "startLiveActivity": NSStringFromSelector(#selector(startLiveActivity(_:options:callback:))),
            "updateLiveActivity": NSStringFromSelector(#selector(updateLiveActivity(_:jsonString:options:callback:))),
            "endLiveActivity": NSStringFromSelector(#selector(endLiveActivity(_:options:callback:))),
            "endAllLiveActivities": NSStringFromSelector(#selector(endAllLiveActivities(_:))),
            "getLatestVoltraActivityId": NSStringFromSelector(#selector(getLatestVoltraActivityId(_:))),
            "listVoltraActivityIds": NSStringFromSelector(#selector(listVoltraActivityIds(_:))),
            "isLiveActivityActive": NSStringFromSelector(#selector(isLiveActivityActive(_:callback:))),
            "isHeadless": NSStringFromSelector(#selector(isHeadless(_:))),
            "reloadLiveActivities": NSStringFromSelector(#selector(reloadLiveActivities(_:callback:))),
            "updateWidget": NSStringFromSelector(#selector(updateWidget(_:jsonString:options:callback:))),
            "scheduleWidget": NSStringFromSelector(#selector(scheduleWidget(_:timelineJson:callback:))),
            "reloadWidgets": NSStringFromSelector(#selector(reloadWidgets(_:callback:))),
            "clearWidget": NSStringFromSelector(#selector(clearWidget(_:callback:))),
            "clearAllWidgets": NSStringFromSelector(#selector(clearAllWidgets(_:))),
            "getActiveWidgets": NSStringFromSelector(#selector(getActiveWidgets(_:))),
            "setWidgetServerCredentials": NSStringFromSelector(#selector(setWidgetServerCredentials(_:callback:))),
            "clearWidgetServerCredentials": NSStringFromSelector(#selector(clearWidgetServerCredentials(_:))),
            "preloadImages": NSStringFromSelector(#selector(preloadImages(_:callback:))),
            "clearPreloadedImages": NSStringFromSelector(#selector(clearPreloadedImages(_:callback:))),
        ]
    }

    private weak var lynxContext: LynxContext?
    private let impl = VoltraModuleImpl()

    required init(context: LynxContext) {
        self.lynxContext = context
        super.init()
        setupEventForwarding()
        impl.startMonitoring()
    }

    deinit {
        impl.stopMonitoring()
    }

    // MARK: - Event Forwarding

    private func setupEventForwarding() {
        VoltraEventBus.shared.subscribe { [weak self] event in
            self?.lynxContext?.sendGlobalEvent("voltra:\(event.type)", withParams: event.data)
        }
    }

    // MARK: - Live Activity Methods (US-013)

    @objc func startLiveActivity(_ jsonString: String, options: NSDictionary?, callback: @escaping (Any?) -> Void) {
        let opts = StartVoltraOptions(from: options)
        Task {
            do {
                let activityId = try await impl.startLiveActivity(jsonString: jsonString, options: opts)
                callback(activityId)
            } catch {
                callback(nil)
            }
        }
    }

    @objc func updateLiveActivity(_ activityId: String, jsonString: String, options: NSDictionary?, callback: @escaping (Any?) -> Void) {
        let opts = UpdateVoltraOptions(from: options)
        Task {
            do {
                try await impl.updateLiveActivity(activityId: activityId, jsonString: jsonString, options: opts)
                callback(nil)
            } catch {
                callback(nil)
            }
        }
    }

    @objc func endLiveActivity(_ activityId: String, options: NSDictionary?, callback: @escaping (Any?) -> Void) {
        let opts = EndVoltraOptions(from: options)
        Task {
            do {
                try await impl.endLiveActivity(activityId: activityId, options: opts)
                callback(nil)
            } catch {
                callback(nil)
            }
        }
    }

    @objc func endAllLiveActivities(_ callback: @escaping (Any?) -> Void) {
        Task {
            do {
                try await impl.endAllLiveActivities()
                callback(nil)
            } catch {
                callback(nil)
            }
        }
    }

    @objc func getLatestVoltraActivityId(_ callback: @escaping (Any?) -> Void) {
        Task {
            let id = await impl.getLatestVoltraActivityId()
            callback(id)
        }
    }

    @objc func listVoltraActivityIds(_ callback: @escaping (Any?) -> Void) {
        Task {
            let ids = await impl.listVoltraActivityIds()
            callback(ids)
        }
    }

    @objc func isLiveActivityActive(_ activityName: String, callback: @escaping (Any?) -> Void) {
        let result = impl.isLiveActivityActive(activityName: activityName)
        callback(result)
    }

    @objc func isHeadless(_ callback: @escaping (Any?) -> Void) {
        callback(impl.isHeadless())
    }

    @objc func reloadLiveActivities(_ activityNames: NSArray?, callback: @escaping (Any?) -> Void) {
        let names = activityNames as? [String]
        Task {
            do {
                try await impl.reloadLiveActivities(activityNames: names)
                callback(nil)
            } catch {
                callback(nil)
            }
        }
    }

    // MARK: - Widget Methods (US-014)

    @objc func updateWidget(_ widgetId: String, jsonString: String, options: NSDictionary?, callback: @escaping (Any?) -> Void) {
        let deepLinkUrl = options?["deepLinkUrl"] as? String
        Task {
            do {
                try await impl.updateWidget(widgetId: widgetId, jsonString: jsonString, deepLinkUrl: deepLinkUrl)
                callback(nil)
            } catch {
                callback(nil)
            }
        }
    }

    @objc func scheduleWidget(_ widgetId: String, timelineJson: String, callback: @escaping (Any?) -> Void) {
        Task {
            do {
                try await impl.scheduleWidget(widgetId: widgetId, timelineJson: timelineJson)
                callback(nil)
            } catch {
                callback(nil)
            }
        }
    }

    @objc func reloadWidgets(_ widgetIds: NSArray?, callback: @escaping (Any?) -> Void) {
        let ids = widgetIds as? [String]
        Task {
            do {
                try await impl.reloadWidgets(widgetIds: ids)
                callback(nil)
            } catch {
                callback(nil)
            }
        }
    }

    @objc func clearWidget(_ widgetId: String, callback: @escaping (Any?) -> Void) {
        Task {
            do {
                try await impl.clearWidget(widgetId: widgetId)
                callback(nil)
            } catch {
                callback(nil)
            }
        }
    }

    @objc func clearAllWidgets(_ callback: @escaping (Any?) -> Void) {
        Task {
            do {
                try await impl.clearAllWidgets()
                callback(nil)
            } catch {
                callback(nil)
            }
        }
    }

    @objc func getActiveWidgets(_ callback: @escaping (Any?) -> Void) {
        Task {
            do {
                let widgets = try await impl.getActiveWidgets()
                callback(widgets)
            } catch {
                callback([Any]())
            }
        }
    }

    // MARK: - Image Preloading & Utilities (US-016)

    @objc func preloadImages(_ images: NSArray, callback: @escaping (Any?) -> Void) {
        guard let imageArray = images as? [[String: Any]] else {
            callback(["succeeded": [String](), "failed": [Any]()] as NSDictionary)
            return
        }

        Task {
            do {
                let result = try await impl.preloadImages(images: imageArray)
                callback(result)
            } catch {
                callback(["succeeded": [String](), "failed": [Any]()] as NSDictionary)
            }
        }
    }

    @objc func clearPreloadedImages(_ keys: NSArray?, callback: @escaping (Any?) -> Void) {
        let keyArray = keys as? [String]
        Task {
            do {
                try await impl.clearPreloadedImages(keys: keyArray)
                callback(nil)
            } catch {
                callback(nil)
            }
        }
    }

    @objc func setWidgetServerCredentials(_ credentials: NSDictionary, callback: @escaping (Any?) -> Void) {
        guard let creds = credentials as? [String: Any] else {
            callback(nil)
            return
        }

        Task {
            do {
                try await impl.setWidgetServerCredentials(credentials: creds)
                callback(nil)
            } catch {
                callback(nil)
            }
        }
    }

    @objc func clearWidgetServerCredentials(_ callback: @escaping (Any?) -> Void) {
        Task {
            do {
                try await impl.clearWidgetServerCredentials()
                callback(nil)
            } catch {
                callback(nil)
            }
        }
    }
}
