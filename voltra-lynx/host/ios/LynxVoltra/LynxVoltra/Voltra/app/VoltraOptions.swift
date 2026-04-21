import Foundation

/// Shared options for both startLiveActivity and updateLiveActivity
public struct SharedVoltraOptions {
  public var staleDate: Double?
  public var relevanceScore: Double?
  public init() {}
}

/// Options for starting a Live Activity
public struct StartVoltraOptions {
  public var activityName: String?
  public var deepLinkUrl: String?
  public var staleDate: Double?
  public var relevanceScore: Double?
  public var channelId: String?
  public init() {}

  public init(from dict: NSDictionary?) {
    guard let dict = dict else { return }
    self.activityName = dict["activityName"] as? String
    self.deepLinkUrl = dict["deepLinkUrl"] as? String
    self.staleDate = dict["staleDate"] as? Double
    self.relevanceScore = dict["relevanceScore"] as? Double
    self.channelId = dict["channelId"] as? String
  }
}

/// Options for updating a Live Activity
public typealias UpdateVoltraOptions = SharedVoltraOptions

extension UpdateVoltraOptions {
  public init(from dict: NSDictionary?) {
    self.init()
    guard let dict = dict else { return }
    self.staleDate = dict["staleDate"] as? Double
    self.relevanceScore = dict["relevanceScore"] as? Double
  }
}

/// Options for ending a Live Activity
public struct EndVoltraOptions {
  public var dismissalPolicy: DismissalPolicyOptions?
  public init() {}

  public init(from dict: NSDictionary?) {
    self.init()
    guard let dict = dict else { return }
    if let dp = dict["dismissalPolicy"] as? [String: Any] {
      var policy = DismissalPolicyOptions()
      policy.type = dp["type"] as? String ?? "immediate"
      policy.date = dp["date"] as? Double
      self.dismissalPolicy = policy
    }
  }
}

/// Dismissal policy options
public struct DismissalPolicyOptions {
  public var type: String = "immediate"
  public var date: Double?
  public init() {}
}

/// Options for updating a home screen widget
public struct UpdateWidgetOptions {
  public var deepLinkUrl: String?
  public init() {}
}
