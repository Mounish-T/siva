/// A playable music track.
///
/// Fields map to the Jamendo `/tracks` response. See
/// https://developer.jamendo.com/v3.0/tracks
class Track {
  const Track({
    required this.id,
    required this.title,
    required this.artist,
    required this.audioUrl,
    required this.imageUrl,
    required this.durationSeconds,
    this.album,
  });

  final String id;
  final String title;
  final String artist;
  final String audioUrl;
  final String imageUrl;
  final int durationSeconds;
  final String? album;

  Duration get duration => Duration(seconds: durationSeconds);

  String get durationLabel {
    final m = duration.inMinutes;
    final s = duration.inSeconds.remainder(60).toString().padLeft(2, '0');
    return '$m:$s';
  }

  factory Track.fromJamendo(Map<String, dynamic> json) {
    return Track(
      id: json['id']?.toString() ?? '',
      title: (json['name'] as String?) ?? 'Untitled',
      artist: (json['artist_name'] as String?) ?? 'Unknown Artist',
      album: json['album_name'] as String?,
      audioUrl: (json['audio'] as String?) ?? '',
      imageUrl: (json['image'] as String?) ??
          (json['album_image'] as String?) ??
          '',
      // Jamendo returns duration as int seconds.
      durationSeconds: (json['duration'] as num?)?.toInt() ?? 0,
    );
  }

  @override
  bool operator ==(Object other) => other is Track && other.id == id;

  @override
  int get hashCode => id.hashCode;
}
