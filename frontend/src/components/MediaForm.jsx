import { useState, useEffect } from 'react';

function MediaForm({ onSubmit, onCancel, initialData = null }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('movie');
  const [rating, setRating] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setType(initialData.type || 'movie');
      setRating(initialData.rating?.toString() || '');
      setNotes(initialData.notes || '');
    }
  }, [initialData]);

  async function handleSubmit(e) {
    e.preventDefault();
    
    const ratingNum = parseFloat(rating);
    if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 10) {
      alert('Puan 0 ile 10 arasında olmalıdır');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        title: title.trim(),
        type,
        rating: ratingNum,
        notes: notes.trim()
      });
      
      // Form reset
      if (!initialData) {
        setTitle('');
        setType('movie');
        setRating('');
        setNotes('');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
      <h3 className="text-2xl font-bold text-white mb-6">
        {initialData ? 'Düzenle' : 'Yeni Ekle'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Başlık
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Film veya oyun adı"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tür
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="movie"
                checked={type === 'movie'}
                onChange={(e) => setType(e.target.value)}
                className="mr-2"
              />
              <span className="text-white">🎬 Film</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="game"
                checked={type === 'game'}
                onChange={(e) => setType(e.target.value)}
                className="mr-2"
              />
              <span className="text-white">🎮 Oyun</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Puan (0-10)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="8.7"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Notlar (Opsiyonel)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="3"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Düşünceleriniz..."
          />
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Kaydediliyor...' : (initialData ? 'Güncelle' : 'Ekle')}
          </button>
          {initialData && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition duration-200"
            >
              İptal
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default MediaForm;

