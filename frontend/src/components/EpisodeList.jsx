import { useState } from 'react';
import StarRating from './StarRating';

function EpisodeList({ episodes, onEdit, onDelete }) {
  const [expandedSeasons, setExpandedSeasons] = useState(new Set([1])); // First season expanded by default

  // Group episodes by season
  const episodesBySeason = episodes.reduce((acc, episode) => {
    const season = episode.seasonNumber;
    if (!acc[season]) {
      acc[season] = [];
    }
    acc[season].push(episode);
    return acc;
  }, {});

  const seasons = Object.keys(episodesBySeason).sort((a, b) => parseInt(a) - parseInt(b));

  const toggleSeason = (season) => {
    const newExpanded = new Set(expandedSeasons);
    if (newExpanded.has(season)) {
      newExpanded.delete(season);
    } else {
      newExpanded.add(season);
    }
    setExpandedSeasons(newExpanded);
  };

  if (episodes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📺</div>
        <p className="text-gray-400 text-lg">Henüz bölüm eklenmemiş</p>
        <p className="text-gray-500 text-sm mt-2">
          Yukarıdaki butona tıklayarak ilk bölümü ekleyin
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {seasons.map((season) => {
        const seasonNum = parseInt(season);
        const seasonEpisodes = episodesBySeason[season];
        const isExpanded = expandedSeasons.has(seasonNum);
        const episodeCount = seasonEpisodes.length;
        const avgRating = seasonEpisodes.reduce((sum, ep) => sum + (ep.rating || 0), 0) / episodeCount;

        return (
          <div key={season} className="bg-dark-900 border border-gold/30 rounded-lg overflow-hidden">
            {/* Season Header */}
            <button
              onClick={() => toggleSeason(seasonNum)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-dark-850 transition-colors duration-200"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{isExpanded ? '📂' : '📁'}</span>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-gold">
                    Sezon {season}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {episodeCount} bölüm
                    {avgRating > 0 && ` • Ortalama: ${avgRating.toFixed(1)}/10`}
                  </p>
                </div>
              </div>
              <div className="text-gold text-2xl">
                {isExpanded ? '▼' : '▶'}
              </div>
            </button>

            {/* Episodes List */}
            {isExpanded && (
              <div className="border-t border-gold/30">
                {seasonEpisodes.map((episode) => (
                  <div
                    key={episode.id}
                    className="px-6 py-4 border-b border-gold/10 last:border-b-0 hover:bg-dark-850 transition-colors duration-200"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        {/* Episode Number and Title */}
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-gold font-mono font-bold text-sm">
                            S{String(episode.seasonNumber).padStart(2, '0')}E{String(episode.episodeNumber).padStart(2, '0')}
                          </span>
                          <h4 className="text-white font-semibold text-lg">
                            {episode.title}
                          </h4>
                        </div>

                        {/* Rating */}
                        {episode.rating > 0 && (
                          <div className="mb-2">
                            <StarRating value={episode.rating} readonly size="sm" />
                          </div>
                        )}

                        {/* Notes */}
                        {episode.notes && (
                          <p className="text-gray-400 text-sm mt-2">
                            {episode.notes}
                          </p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEdit(episode)}
                          className="px-3 py-1 bg-dark-850 hover:bg-gold/20 border border-gold/30 text-gold rounded transition-colors duration-200 text-sm"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => onDelete(episode)}
                          className="px-3 py-1 bg-dark-850 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded transition-colors duration-200 text-sm"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default EpisodeList;

