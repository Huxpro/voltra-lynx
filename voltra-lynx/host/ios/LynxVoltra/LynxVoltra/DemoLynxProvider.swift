import Foundation

/// Loads Lynx bundles from the dev server or local bundle
class DemoLynxProvider: NSObject, LynxTemplateProvider {
  func loadTemplate(withUrl url: String!, onComplete callback: LynxTemplateLoadBlock!) {
    // Try loading from dev server first (http URL)
    if url.hasPrefix("http") {
      guard let requestUrl = URL(string: url) else {
        let error = NSError(domain: "com.voltra.lynx", code: 400, userInfo: [NSLocalizedDescriptionKey: "Invalid URL: \(url ?? "nil")"])
        callback(nil, error)
        return
      }

      URLSession.shared.dataTask(with: requestUrl) { data, response, error in
        if let error = error {
          callback(nil, error)
          return
        }
        callback(data, nil)
      }.resume()
      return
    }

    // Local bundle
    if let filePath = Bundle.main.path(forResource: url, ofType: "bundle") {
      do {
        let data = try Data(contentsOf: URL(fileURLWithPath: filePath))
        callback(data, nil)
      } catch {
        callback(nil, error)
      }
    } else {
      let error = NSError(domain: "com.voltra.lynx", code: 404, userInfo: [NSLocalizedDescriptionKey: "Bundle not found: \(url ?? "nil")"])
      callback(nil, error)
    }
  }
}
