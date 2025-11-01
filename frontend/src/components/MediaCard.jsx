import { useState } from 'react';
import StarRating from './StarRating';

const CATEGORY_EMOJIS = {
  'Film': '🎬',
  'Dizi': '📺',
  'Anime': '🎌',
  'Oyun': '🎮'
};

const CATEGORY_COLORS = {
  'Film': 'bg-purple-600',
  'Dizi': 'bg-blue-600',
  'Anime': 'bg-pink-600',
  'Oyun': 'bg-green-600'
};

function MediaCard({ media, onDelete, onEdit }) {
  const [showMenu, setShowMenu] = useState(false);
  const [imageError, setImageError] = useState(false);

  const categoryEmoji = CATEGORY_EMOJIS[media.category] || '📁';
  const categoryColor = CATEGORY_COLORS[media.category] || 'bg-gray-600';
  const hasImage = media.imageUrl && !imageError;

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden">
      {/* Poster/Image */}
      {hasImage ? (
        <div className="relative h-64 w-full overflow-hidden bg-gray-700">
          <img
            src={media.imageUrl}
            alt={media.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="bg-gray-900/80 hover:bg-gray-900 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            >
              ⋮
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-gray-700 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    onEdit(media);
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600 rounded-t-lg"
                >
                  ✏️ Düzenle
                </button>
                <button
                  onClick={() => {
                    onDelete(media.id);
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-600 rounded-b-lg"
                >
                  🗑️ Sil
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="relative h-64 w-full bg-gray-700 flex items-center justify-center">
          <span className="text-6xl">{categoryEmoji}</span>
          <div className="absolute top-2 right-2">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="bg-gray-900/80 hover:bg-gray-900 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            >
              ⋮
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-gray-700 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    onEdit(media);
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600 rounded-t-lg"
                >
                  ✏️ Düzenle
                </button>
                <button
                  onClick={() => {
                    onDelete(media.id);
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-600 rounded-b-lg"
                >
                  🗑️ Sil
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Category badge */}
        <div className="flex items-center justify-between mb-2">
          <span className={`${categoryColor} text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1`}>
            <span>{categoryEmoji}</span>
            <span>{media.category}</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
          {media.title}
        </h3>
        
        {/* Star Rating */}
        <div className="mb-3">
          <StarRating value={media.rating} readonly size="sm" />
        </div>

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
