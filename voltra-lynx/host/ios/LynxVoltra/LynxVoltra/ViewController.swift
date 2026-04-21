import UIKit

class ViewController: UIViewController {
  // Change this to your Rspeedy dev server URL
  private let bundleURL = "http://localhost:3000/main.lynx.bundle"

  override func viewDidLoad() {
    super.viewDidLoad()
    view.backgroundColor = .white

    let lynxView = LynxView { builder in
      builder.config = LynxConfig(provider: DemoLynxProvider())
      builder.screenSize = self.view.frame.size
      builder.fontScale = 1.0
    }

    lynxView.preferredLayoutWidth = view.frame.size.width
    lynxView.preferredLayoutHeight = view.frame.size.height
    lynxView.layoutWidthMode = .exact
    lynxView.layoutHeightMode = .exact
    lynxView.frame = view.bounds
    lynxView.autoresizingMask = [.flexibleWidth, .flexibleHeight]

    view.addSubview(lynxView)

    // Load Voltra bundle from dev server
    lynxView.loadTemplate(fromURL: bundleURL, initData: nil)
  }
}
