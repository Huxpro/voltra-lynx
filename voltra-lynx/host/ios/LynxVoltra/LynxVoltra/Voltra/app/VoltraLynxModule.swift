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
      "startLiveActivity": NSStringFromSelector(#selector(startLiveActivity(_:options:callback:))),
      "updateLiveActivity": NSStringFromSelector(#selector(updateLiveActivity(_:jsonString:options:callback:))),
      "endLiveActivity": NSStringFromSelector(#selector(endLiveActivity(_:options:callback:))),
      "endAllLiveActivities": NSStringFromSelector(#selector(endAllLiveActivities(_:))),
      "isLiveActivityActive": NSStringFromSelector(#selector(isLiveActivityActive(_:callback:))),
      "isHeadless": NSStringFromSelector(#selector(isHeadless(_:))),
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

  @objc func isHeadless(_ callback: @escaping LynxCallbackBlock) {
    callback(NSNumber(value: impl.isHeadless()))
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
