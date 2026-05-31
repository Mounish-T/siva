import 'package:dio/dio.dart';

import '../config/app_config.dart';
import '../models/track.dart';

/// Wraps the Jamendo API.
///
/// All endpoints require a `client_id` query parameter (free, register at
/// https://devportal.jamendo.com/).
class JamendoService {
  JamendoService({Dio? dio})
      : _dio = dio ??
            Dio(BaseOptions(
              baseUrl: AppConfig.jamendoBaseUrl,
              connectTimeout: const Duration(seconds: 15),
              receiveTimeout: const Duration(seconds: 20),
            ));

  final Dio _dio;

  Map<String, dynamic> _baseParams({
    int limit = 20,
    int offset = 0,
    Map<String, dynamic> extra = const {},
  }) {
    return {
      'client_id': AppConfig.jamendoClientId,
      'format': 'json',
      'limit': limit,
      'offset': offset,
      // Only show tracks with a streamable audio URL.
      'include': 'musicinfo',
      'audioformat': 'mp32',
      ...extra,
    };
  }

  Future<List<Track>> _fetchTracks(
    String path, {
    Map<String, dynamic>? extra,
    int limit = 20,
    int offset = 0,
  }) async {
    if (!AppConfig.jamendoConfigured) {
      throw const JamendoException(
        'Jamendo client ID not configured. Pass --dart-define=JAMENDO_CLIENT_ID=...',
      );
    }
    try {
      final res = await _dio.get<Map<String, dynamic>>(
        path,
        queryParameters: _baseParams(
          limit: limit,
          offset: offset,
          extra: extra ?? const {},
        ),
      );
      final results = (res.data?['results'] as List?) ?? const [];
      return results
          .whereType<Map<String, dynamic>>()
          .map(Track.fromJamendo)
          .where((t) => t.audioUrl.isNotEmpty)
          .toList();
    } on DioException catch (e) {
      throw JamendoException('Network error: ${e.message}');
    }
  }

  /// Most-popular tracks this week.
  Future<List<Track>> trending({int limit = 20, int offset = 0}) {
    return _fetchTracks(
      '/tracks/',
      extra: {'order': 'popularity_week'},
      limit: limit,
      offset: offset,
    );
  }

  /// Newest tracks first.
  Future<List<Track>> latest({int limit = 20, int offset = 0}) {
    return _fetchTracks(
      '/tracks/',
      extra: {'order': 'releasedate_desc'},
      limit: limit,
      offset: offset,
    );
  }

  /// Tracks filtered by tag (genre).
  Future<List<Track>> byTag(String tag, {int limit = 20, int offset = 0}) {
    return _fetchTracks(
      '/tracks/',
      extra: {'tags': tag, 'order': 'popularity_total'},
      limit: limit,
      offset: offset,
    );
  }

  /// Free-text search across tracks.
  Future<List<Track>> search(String query, {int limit = 30}) {
    final q = query.trim();
    if (q.isEmpty) return Future.value(const []);
    return _fetchTracks(
      '/tracks/',
      extra: {'search': q, 'order': 'popularity_total'},
      limit: limit,
    );
  }
}

class JamendoException implements Exception {
  const JamendoException(this.message);
  final String message;
  @override
  String toString() => 'JamendoException: $message';
}
