import { useState, useEffect } from 'react';
import StarRating from './StarRating';

function EpisodeForm({ onSubmit, onCancel, initialData = null }) {
  const [seasonNumber, setSeasonNumber] = useState('');
  const [episodeNumber, setEpisodeNumber] = useState('');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setSeasonNumber(initialData.seasonNumber?.toString() || '');
      setEpisodeNumber(initialData.episodeNumber?.toString() || '');
      setTitle(initialData.title || '');
      setNotes(initialData.notes || '');
      setRating(initialData.rating || 0);
    }
  }, [initialData]);

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!seasonNumber || !episodeNumber) {
      alert('Sezon ve bölüm numarası gereklidir');
      return;
    }

    if (!title.trim()) {
      alert('Bölüm başlığı gereklidir');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        seasonNumber: parseInt(seasonNumber),
        episodeNumber: parseInt(episodeNumber),
        title: title.trim(),
        notes: notes.trim(),
        rating: rating || 0
      });
      
      // Form reset
      if (!initialData) {
        setSeasonNumber('');
        setEpisodeNumber('');
        setTitle('');
        setNotes('');
        setRating(0);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-dark-900 border border-gold/30 rounded-lg p-6 shadow-glow-sm">
      <h3 className="text-xl font-bold text-gold mb-4">
        {initialData ? '✏️ Bölümü Düzenle' : '➕ Yeni Bölüm Ekle'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Sezon ve Bölüm Numarası */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sezon Numarası *
            </label>
            <input
              type="number"
              value={seasonNumber}
              onChange={(e) => setSeasonNumber(e.target.value)}
              required
              min="1"
              className="w-full px-4 py-2 bg-dark-850 border border-gold/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:shadow-glow-sm transition-all duration-300"
              placeholder="1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bölüm Numarası *
            </label>
            <input
              type="number"
              value={episodeNumber}
              onChange={(e) => setEpisodeNumber(e.target.value)}
              required
              min="1"
              className="w-full px-4 py-2 bg-dark-850 border border-gold/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:shadow-glow-sm transition-all duration-300"
              placeholder="1"
            />
          </div>
        </div>

        {/* Başlık */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Bölüm Başlığı *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 bg-dark-850 border border-gold/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:shadow-glow-sm transition-all duration-300"
            placeholder="Örn: The Beginning"
          />
        </div>

        {/* Puan (Opsiyonel) */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Puan (Opsiyonel, 10 üzerinden)
          </label>
          <StarRating
            value={rating}
            onChange={setRating}
            size="md"
          />
        </div>

        {/* Notlar */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Notlar (Opsiyonel)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="3"
            className="w-full px-4 py-2 bg-dark-850 border border-gold/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:shadow-glow-sm transition-all duration-300"
            placeholder="Bu bölüm hakkında notlarınız..."
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Kaydediliyor...' : (initialData ? '💾 Güncelle' : '➕ Ekle')}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 btn-secondary py-3"
            >
              ✕ İptal
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default EpisodeForm;

