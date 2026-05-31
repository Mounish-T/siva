import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/models/track.dart';
import '../../core/services/providers.dart';
import '../../core/theme/app_theme.dart';
import '../../widgets/track_tile.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final trending = ref.watch(trendingTracksProvider);
    final latest = ref.watch(latestTracksProvider);

    return RefreshIndicator(
      color: AppTheme.brand,
      backgroundColor: AppTheme.surface,
      onRefresh: () async {
        ref.invalidate(trendingTracksProvider);
        ref.invalidate(latestTracksProvider);
        await Future.wait([
          ref.read(trendingTracksProvider.future),
          ref.read(latestTracksProvider.future),
        ]);
      },
      child: CustomScrollView(
        slivers: [
          const SliverAppBar(
            pinned: false,
            floating: true,
            title: Text(
              'Good evening',
              style: TextStyle(fontWeight: FontWeight.w800, fontSize: 22),
            ),
          ),
          SliverToBoxAdapter(
            child: _Section(
              title: 'Trending now',
              child: _HorizontalTrackList(asyncTracks: trending),
            ),
          ),
          SliverToBoxAdapter(
            child: _Section(
              title: 'Browse genres',
              child: const _GenreGrid(),
            ),
          ),
          SliverToBoxAdapter(
            child: _Section(
              title: 'Fresh releases',
              child: latest.when(
                loading: () => const _LoadingList(),
                error: (e, _) => _ErrorBox(message: e.toString()),
                data: (tracks) => Column(
                  children: [
                    for (var i = 0; i < tracks.length; i++)
                      TrackTile(track: tracks[i], queue: tracks, index: i),
                  ],
                ),
              ),
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 32)),
        ],
      ),
    );
  }
}

class _Section extends StatelessWidget {
  const _Section({required this.title, required this.child});
  final String title;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
            child: Text(
              title,
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700),
            ),
          ),
          child,
        ],
      ),
    );
  }
}

class _HorizontalTrackList extends ConsumerWidget {
  const _HorizontalTrackList({required this.asyncTracks});
  final AsyncValue<List<Track>> asyncTracks;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return asyncTracks.when(
      loading: () => const SizedBox(
        height: 180,
        child: Center(
            child:
                CircularProgressIndicator(color: AppTheme.brand, strokeWidth: 2)),
      ),
      error: (e, _) => _ErrorBox(message: e.toString()),
      data: (tracks) {
        if (tracks.isEmpty) {
          return const Padding(
            padding: EdgeInsets.symmetric(horizontal: 16),
            child: Text('No tracks available',
                style: TextStyle(color: AppTheme.textSecondary)),
          );
        }
        return SizedBox(
          height: 200,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: tracks.length,
            separatorBuilder: (_, __) => const SizedBox(width: 12),
            itemBuilder: (_, i) => _TrackCard(
              track: tracks[i],
              onTap: () => ref
                  .read(playerServiceProvider)
                  .setQueue(tracks, startIndex: i),
            ),
          ),
        );
      },
    );
  }
}

class _TrackCard extends StatelessWidget {
  const _TrackCard({required this.track, required this.onTap});
  final Track track;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 140,
      child: InkWell(
        borderRadius: BorderRadius.circular(8),
        onTap: onTap,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: SizedBox(
                width: 140,
                height: 140,
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
            const SizedBox(height: 8),
            Text(
              track.title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(fontWeight: FontWeight.w600),
            ),
            Text(
              track.artist,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                  color: AppTheme.textSecondary, fontSize: 12),
            ),
          ],
        ),
      ),
    );
  }
}

class _GenreGrid extends StatelessWidget {
  const _GenreGrid();

  static const _genres = [
    ('Pop', Color(0xFFE13300)),
    ('Rock', Color(0xFFAF2896)),
    ('Electronic', Color(0xFF1E3264)),
    ('Hip Hop', Color(0xFF8D67AB)),
    ('Jazz', Color(0xFFBC5900)),
    ('Classical', Color(0xFF477D95)),
  ];

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: GridView.count(
        crossAxisCount: 2,
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        mainAxisSpacing: 12,
        crossAxisSpacing: 12,
        childAspectRatio: 2.2,
        children: [
          for (final g in _genres)
            _GenreCard(label: g.$1, color: g.$2),
        ],
      ),
    );
  }
}

class _GenreCard extends ConsumerWidget {
  const _GenreCard({required this.label, required this.color});
  final String label;
  final Color color;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return InkWell(
      borderRadius: BorderRadius.circular(8),
      onTap: () async {
        final tracks =
            await ref.read(tracksByGenreProvider(label.toLowerCase()).future);
        if (tracks.isNotEmpty) {
          await ref.read(playerServiceProvider).setQueue(tracks);
        }
      },
      child: Container(
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(8),
        ),
        padding: const EdgeInsets.all(12),
        alignment: Alignment.topLeft,
        child: Text(
          label,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 16,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
    );
  }
}

class _LoadingList extends StatelessWidget {
  const _LoadingList();
  @override
  Widget build(BuildContext context) {
    return const Padding(
      padding: EdgeInsets.symmetric(vertical: 32),
      child: Center(
        child:
            CircularProgressIndicator(color: AppTheme.brand, strokeWidth: 2),
      ),
    );
  }
}

class _ErrorBox extends StatelessWidget {
  const _ErrorBox({required this.message});
  final String message;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.redAccent.withOpacity(0.1),
          border: Border.all(color: Colors.redAccent.withOpacity(0.3)),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Text(
          message,
          style: const TextStyle(color: Colors.redAccent, fontSize: 13),
        ),
      ),
    );
  }
}
