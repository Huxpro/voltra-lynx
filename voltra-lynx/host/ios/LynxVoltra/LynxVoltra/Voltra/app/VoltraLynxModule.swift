import ActivityKit
import Foundation

/// Error types shared between VoltraLynxModule and VoltraModuleImpl
public enum VoltraErrors: Error {
  case unsupportedOS
  case notFound
  case liveActivitiesNotEnabled
  case unexpectedError(Error)
}

/// Voltra native module for Lynx iOS.
/// Conforms to LynxModule protocol and delegates to VoltraModuleImpl.
@objc
public class VoltraLynxModule: NSObject, LynxModule {

  @objc public class var name: String { "VoltraModule" }

  @objc public class var methodLookup: [String: String] {
    return [
      // Live Activity
      "startLiveActivity": NSStringFromSelector(#selector(startLiveActivity(_:options:callback:))),
      "updateLiveActivity": NSStringFromSelector(#selector(updateLiveActivity(_:jsonString:options:callback:))),
      "endLiveActivity": NSStringFromSelector(#selector(endLiveActivity(_:options:callback:))),
      "endAllLiveActivities": NSStringFromSelector(#selector(endAllLiveActivities(_:))),
      "getLatestVoltraActivityId": NSStringFromSelector(#selector(getLatestVoltraActivityId(_:))),
      "listVoltraActivityIds": NSStringFromSelector(#selector(listVoltraActivityIds(_:))),
      "isLiveActivityActive": NSStringFromSelector(#selector(isLiveActivityActive(_:callback:))),
      "isHeadless": NSStringFromSelector(#selector(isHeadless(_:))),
      "reloadLiveActivities": NSStringFromSelector(#selector(reloadLiveActivities(_:callback:))),
      // Widgets
      "updateWidget": NSStringFromSelector(#selector(updateWidget(_:jsonString:options:callback:))),
      "scheduleWidget": NSStringFromSelector(#selector(scheduleWidget(_:timelineJson:callback:))),
      "reloadWidgets": NSStringFromSelector(#selector(reloadWidgets(_:callback:))),
      "clearWidget": NSStringFromSelector(#selector(clearWidget(_:callback:))),
      "clearAllWidgets": NSStringFromSelector(#selector(clearAllWidgets(_:))),
      "getActiveWidgets": NSStringFromSelector(#selector(getActiveWidgets(_:))),
      // Credentials
      "setWidgetServerCredentials": NSStringFromSelector(#selector(setWidgetServerCredentials(_:callback:))),
      "clearWidgetServerCredentials": NSStringFromSelector(#selector(clearWidgetServerCredentials(_:))),
      // Image Preloading
      "preloadImages": NSStringFromSelector(#selector(preloadImages(_:callback:))),
      "clearPreloadedImages": NSStringFromSelector(#selector(clearPreloadedImages(_:callback:))),
    ]
  }

  private let impl = VoltraModuleImpl()

  public required override init() {
    super.init()
    impl.startMonitoring()
  }

  @objc public required init(param: Any) {
    super.init()
    impl.startMonitoring()
  }

  @objc public func destroy() {
    impl.stopMonitoring()
  }

  // MARK: - Live Activity

  @objc func startLiveActivity(_ jsonString: NSString, options: NSDictionary?, callback: @escaping LynxCallbackBlock) {
    NSLog("[VoltraLynxModule] startLiveActivity called, payload length: \(jsonString.length)")
    let opts = StartVoltraOptions(from: options)
    Task {
      do {
        let activityId = try await impl.startLiveActivity(jsonString: jsonString as String, options: opts)
        NSLog("[VoltraLynxModule] startLiveActivity success: \(activityId)")
        callback(activityId as NSString)
      } catch {
        let errorMsg = "ERROR:\(error.localizedDescription)"
        NSLog("[VoltraLynxModule] startLiveActivity failed: \(error)")
        callback(errorMsg as NSString)
      }
    }
  }

  @objc func updateLiveActivity(_ activityId: NSString, jsonString: NSString, options: NSDictionary?, callback: @escaping LynxCallbackBlock) {
    let opts = UpdateVoltraOptions(from: options)
    Task {
      do {
        try await impl.updateLiveActivity(activityId: activityId as String, jsonString: jsonString as String, options: opts)
        callback(NSNull())
      } catch { callback(NSNull()) }
    }
  }

  @objc func endLiveActivity(_ activityId: NSString, options: NSDictionary?, callback: @escaping LynxCallbackBlock) {
    let opts = EndVoltraOptions(from: options)
    Task {
      do {
        try await impl.endLiveActivity(activityId: activityId as String, options: opts)
        callback(NSNull())
      } catch { callback(NSNull()) }
    }
  }

  @objc func endAllLiveActivities(_ callback: @escaping LynxCallbackBlock) {
    Task {
      do { try await impl.endAllLiveActivities(); callback(NSNull()) }
      catch { callback(NSNull()) }
    }
  }

  @objc func isLiveActivityActive(_ activityName: NSString, callback: @escaping LynxCallbackBlock) {
    callback(NSNumber(value: impl.isLiveActivityActive(name: activityName as String)))
  }

  @objc func getLatestVoltraActivityId(_ callback: @escaping LynxCallbackBlock) {
    callback(impl.getLatestVoltraActivityId() as Any)
  }

  @objc func listVoltraActivityIds(_ callback: @escaping LynxCallbackBlock) {
    callback(impl.listVoltraActivityIds() as NSArray)
  }

  @objc func isHeadless(_ callback: @escaping LynxCallbackBlock) {
    callback(NSNumber(value: impl.isHeadless()))
  }

  @objc func reloadLiveActivities(_ activityNames: NSArray?, callback: @escaping LynxCallbackBlock) {
    let names = activityNames as? [String]
    Task {
      do {
        try await impl.reloadLiveActivities(activityNames: names)
        callback(NSNull())
      } catch { callback(NSNull()) }
    }
  }

  // MARK: - Widgets

  @objc func updateWidget(_ widgetId: NSString, jsonString: NSString, options: NSDictionary?, callback: @escaping LynxCallbackBlock) {
    let opts = UpdateWidgetOptions()
    // opts.deepLinkUrl = options?["deepLinkUrl"] as? String  // TODO if needed
    Task {
      do {
        try await impl.updateWidget(widgetId: widgetId as String, jsonString: jsonString as String, options: opts)
        callback(NSNull())
      } catch {
        NSLog("[VoltraLynxModule] updateWidget failed: \(error)")
        callback(NSNull())
      }
    }
  }

  @objc func scheduleWidget(_ widgetId: NSString, timelineJson: NSString, callback: @escaping LynxCallbackBlock) {
    Task {
      do {
        try await impl.scheduleWidget(widgetId: widgetId as String, timelineJson: timelineJson as String)
        callback(NSNull())
      } catch {
        NSLog("[VoltraLynxModule] scheduleWidget failed: \(error)")
        callback(NSNull())
      }
    }
  }

  @objc func reloadWidgets(_ widgetIds: NSArray?, callback: @escaping LynxCallbackBlock) {
    let ids = widgetIds as? [String]
    Task {
      await impl.reloadWidgets(widgetIds: ids)
      callback(NSNull())
    }
  }

  @objc func clearWidget(_ widgetId: NSString, callback: @escaping LynxCallbackBlock) {
    Task {
      await impl.clearWidget(widgetId: widgetId as String)
      callback(NSNull())
    }
  }

  @objc func clearAllWidgets(_ callback: @escaping LynxCallbackBlock) {
    Task {
      await impl.clearAllWidgets()
      callback(NSNull())
    }
  }

  @objc func getActiveWidgets(_ callback: @escaping LynxCallbackBlock) {
    Task {
      do {
        let widgets = try await impl.getActiveWidgets()
        callback(widgets as NSArray)
      } catch { callback(NSArray()) }
    }
  }

  // MARK: - Server Credentials

  @objc func setWidgetServerCredentials(_ credentials: NSDictionary, callback: @escaping LynxCallbackBlock) {
    guard let token = credentials["token"] as? String else {
      callback(NSNull()); return
    }
    let headers = credentials["headers"] as? [String: String]
    impl.setWidgetServerCredentials(token: token, headers: headers)
    callback(NSNull())
  }

  @objc func clearWidgetServerCredentials(_ callback: @escaping LynxCallbackBlock) {
    impl.clearWidgetServerCredentials()
    callback(NSNull())
  }

  // MARK: - Image Preloading

  @objc func preloadImages(_ images: NSArray, callback: @escaping LynxCallbackBlock) {
    guard let imageArray = images as? [[String: Any]] else {
      callback(["succeeded": [], "failed": []] as NSDictionary); return
    }
    let opts = imageArray.map { PreloadImageOptions(from: $0) }
    Task {
      do {
        let result = try await VoltraImagePreload.preloadImages(images: opts)
        callback(["succeeded": result.succeeded, "failed": result.failed.map { ["key": $0.key, "error": $0.error] }] as NSDictionary)
      } catch { callback(["succeeded": [], "failed": []] as NSDictionary) }
    }
  }

  @objc func clearPreloadedImages(_ keys: NSArray?, callback: @escaping LynxCallbackBlock) {
    Task {
      await VoltraImagePreload.clearPreloadedImages(keys: keys as? [String])
      callback(NSNull())
    }
  }
}
