import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:just_audio/just_audio.dart';

import '../../core/services/providers.dart';
import '../../core/theme/app_theme.dart';

class PlayerScreen extends ConsumerWidget {
  const PlayerScreen({super.key});

  String _fmt(Duration d) {
    final m = d.inMinutes;
    final s = d.inSeconds.remainder(60).toString().padLeft(2, '0');
    return '$m:$s';
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final track = ref.watch(currentTrackProvider).valueOrNull;
    final state = ref.watch(playerStateProvider).valueOrNull;
    final position = ref.watch(positionProvider).valueOrNull ?? Duration.zero;
    final duration = ref.watch(durationProvider).valueOrNull ?? Duration.zero;
    final shuffle = ref.watch(shuffleProvider).valueOrNull ?? false;
    final loop = ref.watch(loopModeProvider).valueOrNull ?? LoopMode.off;
    final favorites = ref.watch(favoritesProvider);

    if (track == null) {
      return Scaffold(
        appBar: AppBar(),
        body: const Center(
          child: Text('Nothing playing',
              style: TextStyle(color: AppTheme.textSecondary)),
        ),
      );
    }

    final isFav = favorites.any((t) => t.id == track.id);
    final isPlaying = state?.playing ?? false;
    final isBuffering = state?.processingState == ProcessingState.buffering ||
        state?.processingState == ProcessingState.loading;

    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.keyboard_arrow_down),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Text('PLAYING FROM QUEUE',
                style: TextStyle(
                    fontSize: 10,
                    letterSpacing: 1.2,
                    color: AppTheme.textSecondary)),
          ],
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(24, 8, 24, 16),
          child: Column(
            children: [
              const Spacer(),
              AspectRatio(
                aspectRatio: 1,
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: track.imageUrl.isEmpty
                      ? Container(color: AppTheme.surfaceElevated)
                      : CachedNetworkImage(
                          imageUrl: track.imageUrl,
                          fit: BoxFit.cover,
                          placeholder: (_, __) =>
                              Container(color: AppTheme.surfaceElevated),
                          errorWidget: (_, __, ___) =>
                              Container(color: AppTheme.surfaceElevated),
                        ),
                ),
              ),
              const SizedBox(height: 32),
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          track.title,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          track.artist,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                              color: AppTheme.textSecondary, fontSize: 15),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: Icon(
                      isFav ? Icons.favorite : Icons.favorite_border,
                      color: isFav ? AppTheme.brand : AppTheme.textSecondary,
                    ),
                    onPressed: () =>
                        ref.read(favoritesProvider.notifier).toggle(track),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              SliderTheme(
                data: SliderTheme.of(context).copyWith(
                  trackHeight: 3,
                  thumbShape:
                      const RoundSliderThumbShape(enabledThumbRadius: 6),
                  overlayShape:
                      const RoundSliderOverlayShape(overlayRadius: 12),
                  activeTrackColor: Colors.white,
                  inactiveTrackColor: const Color(0xFF4A4A4A),
                  thumbColor: Colors.white,
                  overlayColor: Colors.white.withOpacity(0.1),
                ),
                child: Slider(
                  min: 0,
                  max: duration.inMilliseconds.toDouble().clamp(
                      1, double.infinity),
                  value: position.inMilliseconds
                      .clamp(0, duration.inMilliseconds)
                      .toDouble(),
                  onChanged: (v) => ref
                      .read(playerServiceProvider)
                      .seek(Duration(milliseconds: v.toInt())),
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(_fmt(position),
                        style: const TextStyle(
                            color: AppTheme.textSecondary, fontSize: 11)),
                    Text(_fmt(duration),
                        style: const TextStyle(
                            color: AppTheme.textSecondary, fontSize: 11)),
                  ],
                ),
              ),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  IconButton(
                    icon: Icon(
                      Icons.shuffle,
                      color: shuffle ? AppTheme.brand : AppTheme.textSecondary,
                    ),
                    onPressed: () =>
                        ref.read(playerServiceProvider).toggleShuffle(),
                  ),
                  IconButton(
                    iconSize: 36,
                    icon: const Icon(Icons.skip_previous,
                        color: AppTheme.textPrimary),
                    onPressed: () =>
                        ref.read(playerServiceProvider).skipPrevious(),
                  ),
                  Container(
                    width: 64,
                    height: 64,
                    decoration: const BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                    ),
                    child: isBuffering
                        ? const Padding(
                            padding: EdgeInsets.all(20),
                            child: CircularProgressIndicator(
                                strokeWidth: 2, color: Colors.black),
                          )
                        : IconButton(
                            iconSize: 32,
                            icon: Icon(
                              isPlaying ? Icons.pause : Icons.play_arrow,
                              color: Colors.black,
                            ),
                            onPressed: () {
                              final p = ref.read(playerServiceProvider);
                              isPlaying ? p.pause() : p.play();
                            },
                          ),
                  ),
                  IconButton(
                    iconSize: 36,
                    icon: const Icon(Icons.skip_next,
                        color: AppTheme.textPrimary),
                    onPressed: () =>
                        ref.read(playerServiceProvider).skipNext(),
                  ),
                  IconButton(
                    icon: Icon(
                      loop == LoopMode.one ? Icons.repeat_one : Icons.repeat,
                      color: loop == LoopMode.off
                          ? AppTheme.textSecondary
                          : AppTheme.brand,
                    ),
                    onPressed: () =>
                        ref.read(playerServiceProvider).cycleLoopMode(),
                  ),
                ],
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }
}
