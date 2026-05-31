import 'dart:async';

import 'package:just_audio/just_audio.dart';
import 'package:just_audio_background/just_audio_background.dart';

import '../models/track.dart';

/// Singleton wrapper around [AudioPlayer]. Holds a queue and exposes
/// the current [Track] alongside playback streams.
class PlayerService {
  PlayerService._() {
    _player.currentIndexStream.listen((idx) {
      if (idx != null && idx >= 0 && idx < _queue.length) {
        _currentTrack = _queue[idx];
        _currentTrackController.add(_currentTrack);
      } else {
        _currentTrack = null;
        _currentTrackController.add(null);
      }
    });
  }

  static final PlayerService instance = PlayerService._();

  final AudioPlayer _player = AudioPlayer();
  List<Track> _queue = const [];
  Track? _currentTrack;

  final StreamController<Track?> _currentTrackController =
      StreamController<Track?>.broadcast();

  // ---------------- Public streams ----------------

  Stream<Track?> get currentTrackStream => _currentTrackController.stream;
  Track? get currentTrack => _currentTrack;

  Stream<PlayerState> get playerStateStream => _player.playerStateStream;
  Stream<Duration> get positionStream => _player.positionStream;
  Stream<Duration?> get durationStream => _player.durationStream;
  Stream<bool> get shuffleModeEnabledStream => _player.shuffleModeEnabledStream;
  Stream<LoopMode> get loopModeStream => _player.loopModeStream;

  bool get isPlaying => _player.playing;
  Duration get position => _player.position;

  // ---------------- Queue management ----------------

  /// Replace the queue and start playing at [startIndex].
  Future<void> setQueue(List<Track> tracks, {int startIndex = 0}) async {
    if (tracks.isEmpty) return;
    _queue = List.unmodifiable(tracks);

    final source = ConcatenatingAudioSource(
      children: tracks.map(_toAudioSource).toList(),
    );

    try {
      await _player.setAudioSource(source, initialIndex: startIndex);
      await _player.play();
    } catch (e) {
      // Surface to caller via player state stream; don't crash.
      rethrow;
    }
  }

  AudioSource _toAudioSource(Track t) {
    return AudioSource.uri(
      Uri.parse(t.audioUrl),
      tag: MediaItem(
        id: t.id,
        title: t.title,
        artist: t.artist,
        album: t.album,
        duration: t.duration,
        artUri: t.imageUrl.isNotEmpty ? Uri.parse(t.imageUrl) : null,
      ),
    );
  }

  // ---------------- Transport controls ----------------

  Future<void> play() => _player.play();
  Future<void> pause() => _player.pause();
  Future<void> stop() => _player.stop();
  Future<void> seek(Duration position) => _player.seek(position);

  Future<void> skipNext() async {
    if (_player.hasNext) await _player.seekToNext();
  }

  Future<void> skipPrevious() async {
    // Restart current if >3s in, otherwise go to previous.
    if (_player.position.inSeconds > 3) {
      await _player.seek(Duration.zero);
    } else if (_player.hasPrevious) {
      await _player.seekToPrevious();
    } else {
      await _player.seek(Duration.zero);
    }
  }

  Future<void> toggleShuffle() async {
    final enabled = !_player.shuffleModeEnabled;
    if (enabled) await _player.shuffle();
    await _player.setShuffleModeEnabled(enabled);
  }

  Future<void> cycleLoopMode() async {
    const order = [LoopMode.off, LoopMode.all, LoopMode.one];
    final current = _player.loopMode;
    final next = order[(order.indexOf(current) + 1) % order.length];
    await _player.setLoopMode(next);
  }

  Future<void> dispose() async {
    await _currentTrackController.close();
    await _player.dispose();
  }
}
