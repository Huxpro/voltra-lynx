# Voltra Lynx Android ProGuard Rules

# Keep Voltra module classes
-keep class voltra.** { *; }

# Keep Lynx module annotations
-keep @interface com.lynx.tasm.annotation.LynxMethod
-keep class * extends com.lynx.tasm.LynxModule { *; }

# Keep Glance widget classes
-keep class * extends androidx.glance.appwidget.GlanceAppWidget { *; }
-keep class * extends androidx.glance.appwidget.GlanceAppWidgetReceiver { *; }

# Kotlinx Serialization
-keepattributes *Annotation*, InnerClasses
-dontnote kotlinx.serialization.AnnotationsKt
-keepclassmembers class kotlinx.serialization.json.** { *** Companion; }
-keepclasseswithmembers class kotlinx.serialization.json.** {
    kotlinx.serialization.KSerializer serializer(...);
}
-keep,includedescriptorclasses class voltra.**$$serializer { *; }
-keepclassmembers class voltra.** {
    *** Companion;
}
-keepclasseswithmembers class voltra.** {
    kotlinx.serialization.KSerializer serializer(...);
}
