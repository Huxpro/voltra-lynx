import SwiftUI
import WidgetKit

@main
struct VoltraWidgetBundle: WidgetBundle {
  var body: some Widget {
    VoltraWidget()
    VoltraDemoHomeWidget()
  }
}

struct VoltraDemoHomeWidget: Widget {
  let kind = "weather"

  var body: some WidgetConfiguration {
    StaticConfiguration(
      kind: kind,
      provider: VoltraHomeWidgetProvider(widgetId: "weather")
    ) { entry in
      if #available(iOSApplicationExtension 17.0, *) {
        VoltraHomeWidgetView(entry: entry)
          .containerBackground(.fill.tertiary, for: .widget)
      } else {
        VoltraHomeWidgetView(entry: entry)
      }
    }
    .configurationDisplayName("Voltra Widget")
    .description("Display Voltra content on your home screen.")
    .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
  }
}
