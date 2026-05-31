import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:just_audio/just_audio.dart';

import '../models/track.dart';
import 'auth_service.dart';
import 'jamendo_service.dart';
import 'player_service.dart';

// ---------- Services ----------

final jamendoServiceProvider = Provider<JamendoService>((_) => JamendoService());

final playerServiceProvider =
    Provider<PlayerService>((_) => PlayerService.instance);

final authServiceProvider = Provider<AuthService>((_) => AuthService.instance);

// ---------- Feeds ----------

final trendingTracksProvider = FutureProvider<List<Track>>((ref) async {
  return ref.read(jamendoServiceProvider).trending(limit: 20);
});

final latestTracksProvider = FutureProvider<List<Track>>((ref) async {
  return ref.read(jamendoServiceProvider).latest(limit: 20);
});

final tracksByGenreProvider =
    FutureProvider.family<List<Track>, String>((ref, genre) async {
  return ref.read(jamendoServiceProvider).byTag(genre, limit: 20);
});

final searchQueryProvider = StateProvider<String>((_) => '');

final searchResultsProvider = FutureProvider<List<Track>>((ref) async {
  final q = ref.watch(searchQueryProvider);
  if (q.trim().isEmpty) return const [];
  return ref.read(jamendoServiceProvider).search(q);
});

// ---------- Player state ----------

final currentTrackProvider = StreamProvider<Track?>((ref) {
  return ref.read(playerServiceProvider).currentTrackStream;
});

final playerStateProvider = StreamProvider<PlayerState>((ref) {
  return ref.read(playerServiceProvider).playerStateStream;
});

final positionProvider = StreamProvider<Duration>((ref) {
  return ref.read(playerServiceProvider).positionStream;
});

final durationProvider = StreamProvider<Duration?>((ref) {
  return ref.read(playerServiceProvider).durationStream;
});

final shuffleProvider = StreamProvider<bool>((ref) {
  return ref.read(playerServiceProvider).shuffleModeEnabledStream;
});

final loopModeProvider = StreamProvider<LoopMode>((ref) {
  return ref.read(playerServiceProvider).loopModeStream;
});

// ---------- Library (local favorites, in-memory for now) ----------

class FavoritesNotifier extends StateNotifier<List<Track>> {
  FavoritesNotifier() : super(const []);

  bool contains(Track t) => state.any((e) => e.id == t.id);

  void toggle(Track t) {
    state = contains(t)
        ? state.where((e) => e.id != t.id).toList()
        : [...state, t];
  }
}

final favoritesProvider =
    StateNotifierProvider<FavoritesNotifier, List<Track>>(
        (_) => FavoritesNotifier());
