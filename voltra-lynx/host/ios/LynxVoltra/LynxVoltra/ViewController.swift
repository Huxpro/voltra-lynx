import UIKit

class ViewController: UIViewController {
  // Debug → load from rspeedy dev server (hot reload).
  // Release → load main.lynx.bundle embedded in the .app at build time
  //           by the "Bundle Lynx JS" pre-build script (see project.yml).
  // DemoLynxProvider handles both forms — http URLs go through URLSession,
  // bare names go through Bundle.main.path(forResource:ofType:).
  private static let templateURL: String = {
    #if DEBUG
      return "http://localhost:3000/main.lynx.bundle"
    #else
      return "main.lynx"
    #endif
  }()

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

    lynxView.loadTemplate(fromURL: Self.templateURL, initData: nil)
  }
}
