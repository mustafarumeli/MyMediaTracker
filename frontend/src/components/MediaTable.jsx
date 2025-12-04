import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';
import useEpisodes from '../hooks/useEpisodes';

const CATEGORY_EMOJIS = {
  'Film': '🎬',
  'Dizi': '📺',
  'Anime': '🎌',
  'Oyun': '🎮'
};

function MediaTableRow({ media, onDelete, onEdit }) {
  const navigate = useNavigate();
  const { episodes } = useEpisodes(media.id);
  
  const categoryEmoji = CATEGORY_EMOJIS[media.category] || '📁';
  
  // Calculate episode stats
  const episodeCount = episodes.length;
  const episodeAvgRating = episodeCount > 0 && episodes.some(ep => ep.rating > 0)
    ? (episodes.reduce((sum, ep) => sum + (ep.rating || 0), 0) / episodes.filter(ep => ep.rating > 0).length).toFixed(1)
    : '-';

  const handleRowClick = (e) => {
    // Don't navigate if clicking on buttons
    if (e.target.closest('button')) {
      return;
    }
    navigate(`/media/${media.id}`);
  };

  return (
    <tr 
      onClick={handleRowClick}
      className="border-b border-gold/10 hover:bg-dark-850 transition-colors cursor-pointer"
    >
      {/* Poster */}
      <td className="p-3">
        {media.imageUrl ? (
          <img 
            src={media.imageUrl} 
            alt={media.title}
            className="w-16 h-20 object-cover rounded border border-gold/30"
          />
        ) : (
          <div className="w-16 h-20 bg-dark-850 rounded border border-gold/30 flex items-center justify-center text-2xl">
            {categoryEmoji}
          </div>
        )}
      </td>

      {/* Başlık */}
      <td className="p-3">
        <div className="font-semibold text-white mb-1">{media.title}</div>
        
        {/* MAL Pills */}
        <div className="flex flex-wrap gap-1.5 mt-1">
          {/* MAL Score */}
          {media.malScore && (
            <span className="bg-gold/20 border border-gold/50 text-gold px-2 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1">
              <span>⭐</span>
              <span>{media.malScore.toFixed(1)}</span>
            </span>
          )}
          
          {/* Original Title (truncated) */}
          {media.originalTitle && media.originalTitle !== media.title && (
            <span className="bg-dark-850 border border-gold/20 text-gray-300 px-2 py-0.5 rounded-full text-xs max-w-[200px] truncate">
              🎌 {media.originalTitle}
            </span>
          )}
          
          {/* First Genre */}
          {media.genres && media.genres.length > 0 && (
            <span className="bg-dark-850 border border-gold/20 text-gold/80 px-2 py-0.5 rounded-full text-xs">
              {media.genres[0]}
            </span>
          )}
        </div>
      </td>

      {/* Kategori */}
      <td className="p-3">
        <span className="flex items-center gap-1 text-gold">
          <span>{categoryEmoji}</span>
          <span>{media.category}</span>
        </span>
      </td>

      {/* Puan */}
      <td className="p-3">
        <StarRating value={media.rating} readonly size="sm" />
      </td>

      {/* Bölüm Sayısı */}
      <td className="p-3 text-center">
        <span className="text-gold font-semibold">
          {episodeCount > 0 ? episodeCount : '-'}
        </span>
      </td>

      {/* Bölüm Ortalaması */}
      <td className="p-3 text-center">
        <span className="text-gold/80">
          {episodeAvgRating !== '-' ? `${episodeAvgRating}/10` : '-'}
        </span>
      </td>

      {/* Notlar */}
      <td className="p-3 max-w-xs">
        <div className="text-gray-400 text-sm truncate">
          {media.notes || '-'}
        </div>
      </td>

      {/* Tarih */}
      <td className="p-3 text-sm text-gray-500">
        {media.createdAt?.seconds 
          ? new Date(media.createdAt.seconds * 1000).toLocaleDateString('tr-TR')
          : '-'
        }
      </td>

      {/* İşlemler */}
      <td className="p-3">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(media)}
            className="px-3 py-1 bg-dark-850 hover:bg-gold/20 border border-gold/30 text-gold rounded transition-colors duration-200 text-sm"
          >
            ✏️
          </button>
          <button
            onClick={() => {
              if (window.confirm(`${media.title} silinsin mi?`)) {
                onDelete(media.id);
              }
            }}
            className="px-3 py-1 bg-dark-850 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded transition-colors duration-200 text-sm"
          >
            🗑️
          </button>
        </div>
      </td>
    </tr>
  );
}

function MediaTable({ mediaItems, onDelete, onEdit }) {
  const [sortBy, setSortBy] = useState('createdAt'); // Default sort by date
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

  const handleSort = (column) => {
    if (sortBy === column) {
      // Toggle order if same column
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, default to ascending
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const sortedItems = useMemo(() => {
    const sorted = [...mediaItems].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        case 'rating':
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        case 'createdAt':
          aValue = a.createdAt?.seconds || 0;
          bValue = b.createdAt?.seconds || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [mediaItems, sortBy, sortOrder]);

  if (mediaItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📺</div>
        <p className="text-gray-400 text-lg">Henüz medya eklenmemiş</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-gold bg-dark-900">
            <th className="p-3 text-left text-gold font-semibold">Poster</th>
            <th 
              className="p-3 text-left text-gold font-semibold cursor-pointer hover:text-gold-light transition-colors"
              onClick={() => handleSort('title')}
            >
              Başlık
            </th>
            <th 
              className="p-3 text-left text-gold font-semibold cursor-pointer hover:text-gold-light transition-colors"
              onClick={() => handleSort('category')}
            >
              Kategori
            </th>
            <th 
              className="p-3 text-left text-gold font-semibold cursor-pointer hover:text-gold-light transition-colors"
              onClick={() => handleSort('rating')}
            >
              Puan
            </th>
            <th className="p-3 text-center text-gold font-semibold">Bölüm</th>
            <th className="p-3 text-center text-gold font-semibold">Bölüm Ort.</th>
            <th className="p-3 text-left text-gold font-semibold">Notlar</th>
            <th 
              className="p-3 text-left text-gold font-semibold cursor-pointer hover:text-gold-light transition-colors"
              onClick={() => handleSort('createdAt')}
            >
              Tarih
            </th>
            <th className="p-3 text-center text-gold font-semibold">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((media) => (
            <MediaTableRow
              key={media.id}
              media={media}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MediaTable;

