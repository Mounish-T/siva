# Flutter
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.**  { *; }
-keep class io.flutter.util.**  { *; }
-keep class io.flutter.view.**  { *; }
-keep class io.flutter.**  { *; }
-keep class io.flutter.plugins.**  { *; }

# just_audio / audio_service
-keep class com.ryanheise.** { *; }
-keep class com.google.android.exoplayer.** { *; }
-keep class com.google.android.exoplayer2.** { *; }
-dontwarn com.google.android.exoplayer.**
-dontwarn com.google.android.exoplayer2.**

# OkHttp (used by Supabase + Dio underlying)
-dontwarn okhttp3.**
-dontwarn okio.**

# Keep Kotlin metadata
-keep class kotlin.Metadata { *; }

# Keep model classes (no reflection in this app, but safe)
-keep class com.pulse.music.** { *; }
