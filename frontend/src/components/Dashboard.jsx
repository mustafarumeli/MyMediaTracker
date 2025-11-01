import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMediaItems } from '../hooks/useMediaItems';
import MediaForm from './MediaForm';
import MediaList from './MediaList';

function Dashboard() {
  const { currentUser, logout } = useAuth();
  const { mediaItems, loading, addMediaItem, updateMediaItem, deleteMediaItem } = useMediaItems();
  const [editingItem, setEditingItem] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async function handleAddMedia(mediaData) {
    await addMediaItem(mediaData);
    setShowForm(false);
  }

  async function handleUpdateMedia(mediaData) {
    if (editingItem) {
      await updateMediaItem(editingItem.id, mediaData);
      setEditingItem(null);
      setShowForm(false);
    }
  }

  async function handleDeleteMedia(id) {
    if (window.confirm('Silmek istediğinizden emin misiniz?')) {
      await deleteMediaItem(id);
    }
  }

  function handleEditMedia(media) {
    setEditingItem(media);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelEdit() {
    setEditingItem(null);
    setShowForm(false);
  }

  // Get unique categories
  const categories = [...new Set(mediaItems.map(item => item.category))].sort();

  // Filter and search logic
  const filteredMedia = mediaItems.filter(item => {
    const matchesFilter = filter === 'all' || item.category === filter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Statistics
  const stats = {
    total: mediaItems.length,
    avgRating: mediaItems.length > 0
      ? (mediaItems.reduce((sum, item) => sum + item.rating, 0) / mediaItems.length).toFixed(1)
      : '0.0'
  };

  // Category stats
  const categoryStats = categories.reduce((acc, cat) => {
    acc[cat] = mediaItems.filter(item => item.category === cat).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src="/logo.svg" alt="Logo" className="w-10 h-10" />
            <h1 className="text-2xl font-bold">Medya Takip Sistemim</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300 hidden sm:block">{currentUser?.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition duration-200"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Toplam</div>
            <div className="text-3xl font-bold text-white">{stats.total}</div>
          </div>
          {categories.slice(0, 2).map((cat) => (
            <div key={cat} className="bg-gray-800 rounded-lg p-4">
              <div className="text-gray-400 text-sm">{cat}</div>
              <div className="text-3xl font-bold text-white">{categoryStats[cat]}</div>
            </div>
          ))}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Ortalama Puan</div>
            <div className="text-3xl font-bold text-yellow-400">{stats.avgRating}</div>
          </div>
        </div>

        {/* Add New Button (Collapsible) */}
        <div className="mb-8">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              <span className="text-2xl">➕</span>
              <span>Yeni Medya Ekle</span>
            </button>
          ) : (
            <div className="animate-fadeIn">
              <MediaForm
                onSubmit={editingItem ? handleUpdateMedia : handleAddMedia}
                onCancel={handleCancelEdit}
                initialData={editingItem}
                existingCategories={categories}
              />
              {!editingItem && (
                <button
                  onClick={() => setShowForm(false)}
                  className="w-full mt-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition duration-200"
                >
                  ✕ Kapat
                </button>
              )}
            </div>
          )}
        </div>

        {/* Filter and Search */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition duration-200 ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Tümü ({mediaItems.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg transition duration-200 ${
                  filter === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {cat} ({categoryStats[cat]})
              </button>
            ))}
          </div>
          
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Ara..."
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Media List */}
        <MediaList
          media={filteredMedia}
          loading={loading}
          onDelete={handleDeleteMedia}
          onEdit={handleEditMedia}
        />
      </div>
    </div>
  );
}

export default Dashboard;
