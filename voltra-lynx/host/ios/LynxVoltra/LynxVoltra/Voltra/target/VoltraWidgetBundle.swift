import SwiftUI
import WidgetKit

@main
struct VoltraWidgetBundle: WidgetBundle {
  var body: some Widget {
    VoltraWidget()
    VoltraWidget_weather()
  }
}

// MARK: - Home Screen Widget Definitions

struct VoltraWidget_weather: Widget {
  private let widgetId = "weather"

  var body: some WidgetConfiguration {
    StaticConfiguration(
      kind: "\(VoltraStorageKeys.widgetKindPrefix)\(widgetId)",
      provider: VoltraHomeWidgetProvider(widgetId: widgetId)
    ) { entry in
      VoltraHomeWidgetView(entry: entry)
    }
    .configurationDisplayName("Weather Widget")
    .description("Shows current weather conditions")
    .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    .contentMarginsDisabled()
  }
}
