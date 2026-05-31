import 'package:supabase_flutter/supabase_flutter.dart';

import '../config/app_config.dart';

/// Thin wrapper around Supabase auth. All methods are safe to call even when
/// Supabase isn't configured — they will throw a descriptive [AuthException].
class AuthService {
  AuthService._();
  static final AuthService instance = AuthService._();

  SupabaseClient? get _client {
    if (!AppConfig.supabaseConfigured) return null;
    return Supabase.instance.client;
  }

  User? get currentUser => _client?.auth.currentUser;

  bool get isSignedIn => currentUser != null;

  Stream<AuthState> get authStateChanges =>
      _client?.auth.onAuthStateChange ?? const Stream.empty();

  void _requireClient() {
    if (_client == null) {
      throw const AuthException(
        'Supabase is not configured. Pass --dart-define=SUPABASE_URL=... '
        'and --dart-define=SUPABASE_ANON_KEY=...',
      );
    }
  }

  Future<void> signUp({required String email, required String password}) async {
    _requireClient();
    await _client!.auth.signUp(email: email, password: password);
  }

  Future<void> signIn({required String email, required String password}) async {
    _requireClient();
    await _client!.auth.signInWithPassword(email: email, password: password);
  }

  Future<void> signOut() async {
    _requireClient();
    await _client!.auth.signOut();
  }
}
