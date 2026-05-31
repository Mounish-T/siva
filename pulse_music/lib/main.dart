import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:just_audio_background/just_audio_background.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'core/config/app_config.dart';
import 'core/services/auth_service.dart';
import 'core/theme/app_theme.dart';
import 'features/auth/login_screen.dart';
import 'features/home/shell_screen.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Required by just_audio_background for media notifications + lock screen.
  // Must run before runApp.
  await JustAudioBackground.init(
    androidNotificationChannelId: 'com.pulse.music.channel.audio',
    androidNotificationChannelName: 'Pulse Music',
    androidNotificationOngoing: true,
    androidStopForegroundOnPause: true,
  );

  // Init Supabase only if configured — app should still run for demos.
  if (AppConfig.supabaseConfigured) {
    await Supabase.initialize(
      url: AppConfig.supabaseUrl,
      anonKey: AppConfig.supabaseAnonKey,
    );
  }

  runApp(const ProviderScope(child: PulseApp()));
}

class PulseApp extends StatelessWidget {
  const PulseApp({super.key});

  @override
  Widget build(BuildContext context) {
    final hasSession =
        AppConfig.supabaseConfigured && AuthService.instance.isSignedIn;

    return MaterialApp(
      title: 'Pulse Music',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.dark(),
      home: hasSession ? const ShellScreen() : const LoginScreen(),
    );
  }
}
