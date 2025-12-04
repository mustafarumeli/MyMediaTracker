import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';
import useEpisodes from '../hooks/useEpisodes';

const CATEGORY_EMOJIS = {
  'Film': '🎬',
  'Dizi': '📺',
  'Anime': '🎌',
  'Oyun': '🎮'
};

const CATEGORY_COLORS = {
  'Film': 'bg-purple-600/80',
  'Dizi': 'bg-blue-600/80',
  'Anime': 'bg-pink-600/80',
  'Oyun': 'bg-green-600/80'
};

function MediaCard({ media, onDelete, onEdit }) {
  const [showMenu, setShowMenu] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const { episodes, loading: episodesLoading } = useEpisodes(media.id);

  const categoryEmoji = CATEGORY_EMOJIS[media.category] || '📁';
  const categoryColor = CATEGORY_COLORS[media.category] || 'bg-gray-600/80';
  const hasImage = media.imageUrl && !imageError;
  
  // Calculate episode stats
  const episodeCount = episodes.length;
  const episodeAvgRating = episodeCount > 0 && episodes.some(ep => ep.rating > 0)
    ? (episodes.reduce((sum, ep) => sum + (ep.rating || 0), 0) / episodes.filter(ep => ep.rating > 0).length).toFixed(1)
    : null;

  // Puan bazlı glow class belirleme
  const getGlowClass = () => {
    if (media.rating >= 9) return 'masterpiece-glow';
    if (media.rating >= 8) return 'excellent-glow';
    if (media.rating >= 7) return 'good-glow';
    return '';
  };

  const glowClass = getGlowClass();

  const handleCardClick = (e) => {
    // Don't navigate if clicking on menu buttons
    if (e.target.closest('button')) {
      return;
    }
    navigate(`/media/${media.id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`bg-dark-900 rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] cursor-pointer ${glowClass}`}
    >
      {/* Poster/Image */}
      <div className="relative">
        {hasImage ? (
          <div className="relative h-64 w-full overflow-hidden bg-dark-850">
            <img
              src={media.imageUrl}
              alt={media.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 right-2">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="bg-dark-950/90 hover:bg-dark-900 text-gold rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              >
                ⋮
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-32 bg-dark-900 border border-gold/30 rounded-lg shadow-glow-sm z-10">
                  <button
                    onClick={() => {
                      onEdit(media);
                      setShowMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gold hover:bg-dark-850 rounded-t-lg"
                  >
                    ✏️ Düzenle
                  </button>
                  <button
                    onClick={() => {
                      onDelete(media.id);
                      setShowMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-dark-850 rounded-b-lg"
                  >
                    🗑️ Sil
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="relative h-64 w-full bg-dark-850 flex items-center justify-center">
            <span className="text-6xl">{categoryEmoji}</span>
            <div className="absolute top-2 right-2">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="bg-dark-950/90 hover:bg-dark-900 text-gold rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              >
                ⋮
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-32 bg-dark-900 border border-gold/30 rounded-lg shadow-glow-sm z-10">
                  <button
                    onClick={() => {
                      onEdit(media);
                      setShowMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gold hover:bg-dark-850 rounded-t-lg"
                  >
                    ✏️ Düzenle
                  </button>
                  <button
                    onClick={() => {
                      onDelete(media.id);
                      setShowMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-dark-850 rounded-b-lg"
                  >
                    🗑️ Sil
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category badge and MAL Info */}
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <span className={`${categoryColor} text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1`}>
            <span>{categoryEmoji}</span>
            <span>{media.category}</span>
          </span>
          
          {/* MAL Score Badge */}
          {media.malScore && (
            <span className="bg-gold/20 border border-gold/50 text-gold px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <span>⭐</span>
              <span>{media.malScore.toFixed(1)}</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
          {media.title}
        </h3>

        {/* MAL Pills - Original Title & Genres */}
        {(media.originalTitle || (media.genres && media.genres.length > 0)) && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {/* Original Title */}
            {media.originalTitle && media.originalTitle !== media.title && (
              <span className="bg-dark-850 border border-gold/20 text-gray-300 px-2 py-0.5 rounded-full text-xs">
                🎌 {media.originalTitle}
              </span>
            )}
            
            {/* Genres - Show max 3 */}
            {media.genres && media.genres.slice(0, 3).map((genre, index) => (
              <span 
                key={index}
                className="bg-dark-850 border border-gold/20 text-gold/80 px-2 py-0.5 rounded-full text-xs"
              >
                {genre}
              </span>
            ))}
            
            {/* More genres indicator */}
            {media.genres && media.genres.length > 3 && (
              <span className="bg-dark-850 border border-gold/20 text-gray-400 px-2 py-0.5 rounded-full text-xs">
                +{media.genres.length - 3}
              </span>
            )}
          </div>
        )}
        
        {/* Star Rating */}
        <div className="mb-3">
          <StarRating value={media.rating} readonly size="sm" />
        </div>

        {/* Episode Stats */}
        {episodeCount > 0 && (
          <div className="mb-3 flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1 text-gold">
              <span>📝</span>
              <span className="font-semibold">{episodeCount} Bölüm</span>
            </div>
            {episodeAvgRating && (
              <div className="flex items-center gap-1 text-gold/80">
                <span>⭐</span>
                <span>{episodeAvgRating}/10</span>
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        {media.notes && (
          <p className="text-gray-400 text-sm line-clamp-2 mb-3">{media.notes}</p>
        )}

        {/* Date */}
        <div className="text-xs text-gray-500">
          {media.createdAt?.seconds 
            ? new Date(media.createdAt.seconds * 1000).toLocaleDateString('tr-TR')
            : 'Tarih yok'
          }
        </div>
      </div>
    </div>
  );
}

export default MediaCard;
