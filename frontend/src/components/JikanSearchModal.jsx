import { useState, useEffect } from 'react';
import { searchAnime } from '../services/jikanApi';

function JikanSearchModal({ isOpen, onClose, onSelect, initialQuery = '' }) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Auto-search when modal opens with initial query
  useEffect(() => {
    if (isOpen && initialQuery && !hasSearched) {
      handleSearch();
    }
  }, [isOpen, initialQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Lütfen bir arama terimi girin');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const searchResults = await searchAnime(searchQuery);
      setResults(searchResults);
      
      if (searchResults.length === 0) {
        setError('Sonuç bulunamadı');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Arama sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelectAnime = (anime) => {
    onSelect(anime);
    handleClose();
  };

  const handleClose = () => {
    setSearchQuery('');
    setResults([]);
    setError(null);
    setHasSearched(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-900 border-2 border-gold rounded-lg shadow-glow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gold/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gold">🔍 Anime Ara (MyAnimeList)</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gold transition-colors text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Search Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Anime adı girin..."
              className="flex-1 px-4 py-3 bg-dark-950 border border-gold/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors"
              autoFocus
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Aranıyor...' : 'Ara'}
            </button>
          </div>

          {error && (
            <div className="mt-3 text-red-400 text-sm">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin text-4xl mb-4">⏳</div>
              <div className="text-gray-400">Jikan API'den veri çekiliyor...</div>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-4">
              {results.map((anime) => (
                <div
                  key={anime.malId}
                  className="bg-dark-950 border border-gold/20 rounded-lg overflow-hidden hover:border-gold/50 transition-all duration-200"
                >
                  <div className="flex gap-4 p-4">
                    {/* Poster */}
                    <div className="flex-shrink-0">
                      {anime.imageUrl ? (
                        <img
                          src={anime.imageUrl}
                          alt={anime.title}
                          className="w-24 h-32 object-cover rounded"
                        />
                      ) : (
                        <div className="w-24 h-32 bg-dark-800 rounded flex items-center justify-center">
                          <span className="text-4xl">🎌</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white mb-1 truncate">
                        {anime.title}
                      </h3>
                      
                      {anime.titleJapanese && anime.titleJapanese !== anime.title && (
                        <div className="text-sm text-gray-400 mb-2 truncate">
                          {anime.titleJapanese}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 mb-2">
                        {anime.score && (
                          <span className="px-2 py-1 bg-gold/20 text-gold text-xs rounded">
                            ⭐ {anime.score.toFixed(1)}
                          </span>
                        )}
                        {anime.type && (
                          <span className="px-2 py-1 bg-dark-800 text-gray-300 text-xs rounded">
                            {anime.type}
                          </span>
                        )}
                        {anime.episodes && (
                          <span className="px-2 py-1 bg-dark-800 text-gray-300 text-xs rounded">
                            📺 {anime.episodes} Bölüm
                          </span>
                        )}
                        {anime.year && (
                          <span className="px-2 py-1 bg-dark-800 text-gray-300 text-xs rounded">
                            📅 {anime.year}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleSelectAnime(anime)}
                        className="btn-primary text-sm px-4 py-2"
                      >
                        Seç ✓
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && hasSearched && results.length === 0 && !error && (
            <div className="text-center py-12 text-gray-400">
              <div className="text-6xl mb-4">🔍</div>
              <div>Sonuç bulunamadı</div>
            </div>
          )}

          {!loading && !hasSearched && (
            <div className="text-center py-12 text-gray-400">
              <div className="text-6xl mb-4">🎌</div>
              <div>Aramak için bir anime adı girin</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gold/30 bg-dark-950">
          <button
            onClick={handleClose}
            className="btn-secondary w-full py-3"
          >
            İptal
          </button>
        </div>
      </div>
    </div>
  );
}

export default JikanSearchModal;



