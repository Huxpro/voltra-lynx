import SwiftUI
import UIKit

/// A plain UIView that hosts Voltra SwiftUI content via UIHostingController.
/// Used by VoltraPreviewElement (the Lynx Custom Element) to render
/// Voltra JSON payloads inline within the Lynx view hierarchy.
@objc public class VoltraPreviewHostView: UIView {

  private var hostingController: UIHostingController<AnyView>?
  private var root: VoltraNode = .empty
  private var currentViewId: String = "voltra-preview"

  public override init(frame: CGRect) {
    super.init(frame: frame)
    clipsToBounds = true
    backgroundColor = .clear
    setupHostingController()
  }

  @available(*, unavailable)
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  private func setupHostingController() {
    let view = Voltra(root: .empty, activityId: currentViewId)
    let hc = UIHostingController(rootView: AnyView(view))
    hc.view.backgroundColor = .clear
    addSubview(hc.view)
    hostingController = hc
  }

  // MARK: - Props called from ObjC (VoltraPreviewElement)

  @objc public func setPayload(_ jsonString: String) {
    NSLog("[VoltraPreview] setPayload called, length: \(jsonString.count)")
    do {
      let json = try JSONValue.parse(from: jsonString)
      root = VoltraNode.parse(from: json)
      NSLog("[VoltraPreview] Parsed OK, root: \(root)")
    } catch {
      NSLog("[VoltraPreview] Failed to parse payload: \(error)")
      root = .empty
    }
    updateView()
  }

  @objc public func setViewId(_ viewId: String) {
    guard !viewId.isEmpty else { return }
    currentViewId = viewId
    updateView()
  }

  private func updateView() {
    hostingController?.view.removeFromSuperview()

    let newView = Voltra(root: root, activityId: currentViewId)
    let hc = UIHostingController(rootView: AnyView(newView))
    hc.view.backgroundColor = .systemRed.withAlphaComponent(0.3) // DEBUG: visible bg
    hc.view.frame = bounds
    addSubview(hc.view)
    hostingController = hc
    NSLog("[VoltraPreview] updateView, bounds: \(bounds), subviews: \(subviews.count)")
  }

  public override func layoutSubviews() {
    super.layoutSubviews()
    hostingController?.view.frame = bounds
    NSLog("[VoltraPreview] layoutSubviews, bounds: \(bounds)")
  }
}
