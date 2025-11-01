import { useState, useEffect } from 'react';
import StarRating from './StarRating';
import CategoryAutocomplete from './CategoryAutocomplete';
import ImageUpload from './ImageUpload';

function MediaForm({ onSubmit, onCancel, initialData = null, existingCategories = [] }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState(0);
  const [imageData, setImageData] = useState({ url: '', type: 'none' });
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setCategory(initialData.category || '');
      setRating(initialData.rating || 0);
      setImageData({ 
        url: initialData.imageUrl || '', 
        type: initialData.imageType || 'none' 
      });
      setNotes(initialData.notes || '');
    }
  }, [initialData]);

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Başlık gereklidir');
      return;
    }

    if (!category.trim()) {
      alert('Kategori gereklidir');
      return;
    }

    if (rating === 0) {
      alert('Lütfen bir puan verin');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        title: title.trim(),
        category: category.trim(),
        rating,
        imageUrl: imageData.url || '',
        imageType: imageData.type || 'none',
        notes: notes.trim()
      });
      
      // Form reset
      if (!initialData) {
        setTitle('');
        setCategory('');
        setRating(0);
        setImageData({ url: '', type: 'none' });
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
        {initialData ? '✏️ Düzenle' : '➕ Yeni Medya Ekle'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Başlık */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Başlık *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Film, dizi, anime veya oyun adı"
          />
        </div>

        {/* Kategori (Autocomplete) */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Kategori *
          </label>
          <CategoryAutocomplete
            value={category}
            onChange={setCategory}
            suggestions={existingCategories}
          />
        </div>

        {/* Puan (Star Rating) */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Puan * (10 üzerinden)
          </label>
          <StarRating
            value={rating}
            onChange={setRating}
            size="lg"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Poster / Kapak Görseli
          </label>
          <ImageUpload
            value={imageData.url}
            onChange={setImageData}
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
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Düşünceleriniz, yorumlarınız..."
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Kaydediliyor...' : (initialData ? '💾 Güncelle' : '➕ Ekle')}
          </button>
          {initialData && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition duration-200"
            >
              ✕ İptal
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default MediaForm;
