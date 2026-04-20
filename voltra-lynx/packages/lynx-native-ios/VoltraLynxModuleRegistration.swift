import Foundation
import Lynx

/// Register VoltraLynxModule with the Lynx runtime.
/// Call this during app initialization before loading any Lynx pages.
///
/// Usage:
/// ```swift
/// VoltraLynxModuleRegistration.register()
/// ```
@objc
public class VoltraLynxModuleRegistration: NSObject {

    @objc public static func register() {
        LynxEnv.sharedInstance().registerModule(VoltraLynxModule.self)
    }
}
