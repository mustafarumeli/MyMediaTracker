import { useState } from 'react';

function MalInfoSection({ media }) {
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);

  // Check if we have any MAL data
  const hasMalData = media.malId || media.malScore || media.originalTitle || media.synopsis;

  if (!hasMalData) {
    return null;
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('tr-TR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return null;
    }
  };

  const airedDate = formatDate(media.airedFrom);
  const shouldTruncate = media.synopsis && media.synopsis.length > 300;
  const displaySynopsis = shouldTruncate && !synopsisExpanded 
    ? media.synopsis.slice(0, 300) + '...' 
    : media.synopsis;

  return (
    <div className="mt-6 pt-6 border-t border-gold/30">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xl font-bold text-gold">📊 MyAnimeList Bilgileri</h3>
        {media.malId && (
          <a
            href={`https://myanimelist.net/anime/${media.malId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            MAL'de Görüntüle ↗
          </a>
        )}
      </div>

      <div className="space-y-4">
        {/* MAL Score */}
        {media.malScore && (
          <div>
            <div className="text-sm text-gray-400 mb-1">MAL Puanı</div>
            <div className="inline-flex items-center gap-2 px-3 py-2 bg-gold/20 border border-gold/50 rounded-lg">
              <span className="text-2xl">⭐</span>
              <span className="text-2xl font-bold text-gold">{media.malScore.toFixed(2)}</span>
              <span className="text-sm text-gray-300">/ 10</span>
            </div>
          </div>
        )}

        {/* Original Title */}
        {media.originalTitle && media.originalTitle !== media.title && (
          <div>
            <div className="text-sm text-gray-400 mb-1">Orijinal Başlık</div>
            <div className="text-lg text-white font-medium">{media.originalTitle}</div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Total Episodes */}
          {media.totalEpisodes && (
            <div className="bg-dark-950 border border-gold/20 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Toplam Bölüm</div>
              <div className="text-xl font-bold text-gold">{media.totalEpisodes}</div>
            </div>
          )}

          {/* Aired Date */}
          {airedDate && (
            <div className="bg-dark-950 border border-gold/20 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Yayın Tarihi</div>
              <div className="text-sm font-medium text-white">{airedDate}</div>
            </div>
          )}

          {/* Studios Count */}
          {media.studios && media.studios.length > 0 && (
            <div className="bg-dark-950 border border-gold/20 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Stüdyo Sayısı</div>
              <div className="text-xl font-bold text-gold">{media.studios.length}</div>
            </div>
          )}
        </div>

        {/* Studios */}
        {media.studios && media.studios.length > 0 && (
          <div>
            <div className="text-sm text-gray-400 mb-2">Stüdyolar</div>
            <div className="flex flex-wrap gap-2">
              {media.studios.map((studio, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-dark-950 border border-gold/30 text-gold text-sm rounded-full"
                >
                  🏢 {studio}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Genres */}
        {media.genres && media.genres.length > 0 && (
          <div>
            <div className="text-sm text-gray-400 mb-2">Türler</div>
            <div className="flex flex-wrap gap-2">
              {media.genres.map((genre, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gold/10 border border-gold/30 text-white text-sm rounded-full hover:bg-gold/20 transition-colors"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Synopsis */}
        {media.synopsis && (
          <div>
            <div className="text-sm text-gray-400 mb-2">Özet</div>
            <div className="bg-dark-950 border border-gold/20 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {displaySynopsis}
              </p>
              {shouldTruncate && (
                <button
                  onClick={() => setSynopsisExpanded(!synopsisExpanded)}
                  className="mt-3 text-gold hover:text-gold-light text-sm font-medium transition-colors"
                >
                  {synopsisExpanded ? '▲ Daha Az Göster' : '▼ Devamını Oku'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MalInfoSection;

