import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/models/track.dart';
import '../core/services/providers.dart';
import '../core/theme/app_theme.dart';

class TrackTile extends ConsumerWidget {
  const TrackTile({
    super.key,
    required this.track,
    required this.queue,
    required this.index,
  });

  final Track track;
  final List<Track> queue;
  final int index;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final favorites = ref.watch(favoritesProvider);
    final isFav = favorites.any((t) => t.id == track.id);
    final currentTrack = ref.watch(currentTrackProvider).valueOrNull;
    final isPlayingThis = currentTrack?.id == track.id;

    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      leading: ClipRRect(
        borderRadius: BorderRadius.circular(6),
        child: SizedBox(
          width: 52,
          height: 52,
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
      title: Text(
        track.title,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
        style: TextStyle(
          color: isPlayingThis ? AppTheme.brand : AppTheme.textPrimary,
          fontWeight: FontWeight.w600,
        ),
      ),
      subtitle: Text(
        track.artist,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
        style: const TextStyle(color: AppTheme.textSecondary, fontSize: 13),
      ),
      trailing: IconButton(
        icon: Icon(
          isFav ? Icons.favorite : Icons.favorite_border,
          color: isFav ? AppTheme.brand : AppTheme.textSecondary,
          size: 22,
        ),
        onPressed: () => ref.read(favoritesProvider.notifier).toggle(track),
      ),
      onTap: () {
        ref.read(playerServiceProvider).setQueue(queue, startIndex: index);
      },
    );
  }
}
