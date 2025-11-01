import { useState } from 'react';

function MediaCard({ media, onDelete, onEdit }) {
  const [showMenu, setShowMenu] = useState(false);

  const typeLabel = media.type === 'movie' ? '🎬 Film' : '🎮 Oyun';
  const typeColor = media.type === 'movie' ? 'bg-purple-600' : 'bg-green-600';

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200 relative">
      <div className="flex justify-between items-start mb-3">
        <span className={`${typeColor} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
          {typeLabel}
        </span>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
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
                Düzenle
              </button>
              <button
                onClick={() => {
                  onDelete(media.id);
                  setShowMenu(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-600 rounded-b-lg"
              >
                Sil
              </button>
            </div>
          )}
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{media.title}</h3>
      
      <div className="flex items-center mb-3">
        <span className="text-3xl font-bold text-yellow-400">{media.rating.toFixed(1)}</span>
        <span className="text-gray-400 ml-2">/ 10</span>
      </div>

      {media.notes && (
        <p className="text-gray-400 text-sm line-clamp-2">{media.notes}</p>
      )}

      <div className="mt-4 text-xs text-gray-500">
        {new Date(media.createdAt?.seconds * 1000).toLocaleDateString('tr-TR')}
      </div>
    </div>
  );
}

export default MediaCard;

