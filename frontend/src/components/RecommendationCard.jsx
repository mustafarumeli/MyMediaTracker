import { useState } from 'react';

const CATEGORY_COLORS = {
  'Film': 'bg-purple-600/80',
  'Dizi': 'bg-blue-600/80',
  'Anime': 'bg-pink-600/80',
  'Oyun': 'bg-green-600/80'
};

const CATEGORY_EMOJIS = {
  'Film': '🎬',
  'Dizi': '📺',
  'Anime': '🎌',
  'Oyun': '🎮'
};

function RecommendationCard({ recommendation, onAdd }) {
  const [adding, setAdding] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const categoryEmoji = CATEGORY_EMOJIS[recommendation.category] || '📁';
  const categoryColor = CATEGORY_COLORS[recommendation.category] || 'bg-gray-600/80';
  const hasImage = recommendation.imageUrl && !imageError;

  const handleAdd = async () => {
    if (adding) return;
    
    setAdding(true);
    try {
      await onAdd(recommendation);
    } catch (error) {
      console.error('Error adding recommendation:', error);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="bg-dark-900 rounded-lg overflow-hidden border border-gold/30 hover:border-gold transition-all duration-300 hover:shadow-glow-sm group">
      {/* Poster/Image */}
      <div className="relative">
        {hasImage ? (
          <div className="relative h-48 w-full overflow-hidden bg-dark-850">
            <img
              src={recommendation.imageUrl}
              alt={recommendation.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Add Button Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button
                onClick={handleAdd}
                disabled={adding}
                className="bg-gold hover:bg-gold-light text-black font-bold py-2 px-4 rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow"
              >
                {adding ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span>Ekleniyor...</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl">+</span>
                    <span>Ekle</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="relative h-48 w-full bg-dark-850 flex items-center justify-center">
            <span className="text-5xl">{categoryEmoji}</span>
            
            {/* Add Button Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button
                onClick={handleAdd}
                disabled={adding}
                className="bg-gold hover:bg-gold-light text-black font-bold py-2 px-4 rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow"
              >
                {adding ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span>Ekleniyor...</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl">+</span>
                    <span>Ekle</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Category badge and Source */}
        <div className="flex items-center justify-between mb-2">
          <span className={`${categoryColor} text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1`}>
            <span>{categoryEmoji}</span>
            <span>{recommendation.category}</span>
          </span>
          
          {/* Source Badge */}
          {recommendation.source === 'external' ? (
            <span className="bg-green-600/20 border border-green-500/50 text-green-400 px-2 py-1 rounded-full text-xs font-bold">
              ✨ Yeni
            </span>
          ) : (
            <span className="bg-blue-600/20 border border-blue-500/50 text-blue-400 px-2 py-1 rounded-full text-xs font-bold">
              📚 Koleksiyon
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white mb-2 line-clamp-2 min-h-[2.5rem]">
          {recommendation.title}
        </h3>

        {/* Score Badge */}
        {recommendation.malScore && (
          <div className="mb-2 flex items-center gap-1">
            <span className="text-gold text-xs">⭐</span>
            <span className="text-gold/80 text-xs font-semibold">
              {recommendation.malScore.toFixed(1)}
            </span>
          </div>
        )}

        {/* Reason Badge */}
        {recommendation.reason && (
          <div className="mt-2">
            <span className="bg-gold/10 border border-gold/30 text-gold/90 px-2 py-1 rounded-full text-xs inline-block">
              {recommendation.reason}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecommendationCard;

