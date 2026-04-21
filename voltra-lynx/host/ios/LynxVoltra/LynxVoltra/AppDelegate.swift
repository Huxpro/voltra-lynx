import UIKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    // Initialize Lynx Engine with Voltra module
    let config = LynxConfig(provider: DemoLynxProvider())
    config.register(VoltraLynxModule.self)
    LynxEnv.sharedInstance().prepareConfig(config)

    // Setup window
    window = UIWindow(frame: UIScreen.main.bounds)
    window?.rootViewController = ViewController()
    window?.makeKeyAndVisible()

    return true
  }
}
