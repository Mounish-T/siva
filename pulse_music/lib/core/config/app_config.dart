/// App-wide configuration.
///
/// All keys are read from compile-time environment variables passed via
/// `--dart-define`. This keeps secrets out of source control.
///
/// Example release build:
/// ```
/// flutter build apk --release \
///   --dart-define=JAMENDO_CLIENT_ID=xxxxxxxx \
///   --dart-define=SUPABASE_URL=https://xxxx.supabase.co \
///   --dart-define=SUPABASE_ANON_KEY=eyJhbGciOi...
/// ```
class AppConfig {
  AppConfig._();

  /// Get one free at https://devportal.jamendo.com/
  static const String jamendoClientId = String.fromEnvironment(
    'JAMENDO_CLIENT_ID',
    defaultValue: '',
  );

  static const String supabaseUrl = String.fromEnvironment(
    'SUPABASE_URL',
    defaultValue: '',
  );

  static const String supabaseAnonKey = String.fromEnvironment(
    'SUPABASE_ANON_KEY',
    defaultValue: '',
  );

  static const String jamendoBaseUrl = 'https://api.jamendo.com/v3.0';

  /// If true, the app will still run without Supabase configured — auth
  /// screens will be skipped and the home feed will load anonymously.
  /// This makes it easy to demo the player before you set up the backend.
  static bool get supabaseConfigured =>
      supabaseUrl.isNotEmpty && supabaseAnonKey.isNotEmpty;

  static bool get jamendoConfigured => jamendoClientId.isNotEmpty;
}
