import { useState } from 'react';
import RecommendationCard from './RecommendationCard';
import toast from 'react-hot-toast';

function RecommendationWidget({ recommendations, loading, onRefresh, onAddRecommendation }) {
  const [expanded, setExpanded] = useState(true);

  const handleAdd = async (recommendation) => {
    try {
      await onAddRecommendation(recommendation);
      toast.success(`${recommendation.title} eklendi! ✨`, {
        duration: 3000,
        position: 'bottom-right'
      });
    } catch (error) {
      console.error('Error adding recommendation:', error);
      toast.error('Eklenirken bir hata oluştu.', {
        duration: 3000,
        position: 'bottom-right'
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-dark-900 border-2 border-gold/30 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-spin">⏳</div>
            <p className="text-gray-400">Öneriler hazırlanıyor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="bg-dark-900 border-2 border-gold/30 rounded-lg overflow-hidden shadow-glow-lg mb-8 animate-fadeIn">
      {/* Header */}
      <div 
        className="bg-dark-950 border-b border-gold/30 px-6 py-4 cursor-pointer hover:bg-dark-900/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">✨</span>
            <div>
              <h2 className="text-2xl font-bold text-gold">
                Sana Önerebileceklerimiz
              </h2>
              <p className="text-sm text-gray-400">
                Puanlarına ve tercihlerine göre seçildi
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Refresh Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRefresh();
              }}
              className="p-2 bg-dark-850 hover:bg-gold/20 border border-gold/30 rounded-lg text-gold transition-all hover:border-gold"
              title="Yenile"
            >
              <span className="text-xl">🔄</span>
            </button>
            
            {/* Collapse Button */}
            <button className="text-gold text-2xl transition-transform duration-300" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {expanded && (
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {recommendations.map((recommendation, index) => (
              <RecommendationCard
                key={`${recommendation.source}-${recommendation.malId || recommendation.tmdbId || index}`}
                recommendation={recommendation}
                onAdd={handleAdd}
              />
            ))}
          </div>
          
          {/* Info Text */}
          <div className="mt-4 text-center">
            <p className="text-gray-500 text-sm">
              Bu öneriler senin puanlarına ve tercihlerine göre oluşturuldu. Beğenmediysen yenile butonuna tıkla!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecommendationWidget;

