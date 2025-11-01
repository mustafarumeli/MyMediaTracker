import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMediaItems } from '../hooks/useMediaItems';
import MediaForm from './MediaForm';
import MediaList from './MediaList';

function Dashboard() {
  const { currentUser, logout } = useAuth();
  const { mediaItems, loading, addMediaItem, updateMediaItem, deleteMediaItem } = useMediaItems();
  const [editingItem, setEditingItem] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'movie', 'game'
  const [searchQuery, setSearchQuery] = useState('');

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async function handleAddMedia(mediaData) {
    await addMediaItem(mediaData);
  }

  async function handleUpdateMedia(mediaData) {
    if (editingItem) {
      await updateMediaItem(editingItem.id, mediaData);
      setEditingItem(null);
    }
  }

  async function handleDeleteMedia(id) {
    if (window.confirm('Silmek istediğinizden emin misiniz?')) {
      await deleteMediaItem(id);
    }
  }

  function handleEditMedia(media) {
    setEditingItem(media);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelEdit() {
    setEditingItem(null);
  }

  // Filter and search logic
  const filteredMedia = mediaItems.filter(item => {
    const matchesFilter = filter === 'all' || item.type === filter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Statistics
  const stats = {
    total: mediaItems.length,
    movies: mediaItems.filter(item => item.type === 'movie').length,
    games: mediaItems.filter(item => item.type === 'game').length,
    avgRating: mediaItems.length > 0
      ? (mediaItems.reduce((sum, item) => sum + item.rating, 0) / mediaItems.length).toFixed(1)
      : '0.0'
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">🎬 Medya Takip Sistemim</h1>
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
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Filmler</div>
            <div className="text-3xl font-bold text-purple-400">{stats.movies}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Oyunlar</div>
            <div className="text-3xl font-bold text-green-400">{stats.games}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Ortalama Puan</div>
            <div className="text-3xl font-bold text-yellow-400">{stats.avgRating}</div>
          </div>
        </div>

        {/* Add/Edit Form */}
        <div className="mb-8">
          <MediaForm
            onSubmit={editingItem ? handleUpdateMedia : handleAddMedia}
            onCancel={editingItem ? handleCancelEdit : null}
            initialData={editingItem}
          />
        </div>

        {/* Filter and Search */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex gap-2">
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
            <button
              onClick={() => setFilter('movie')}
              className={`px-4 py-2 rounded-lg transition duration-200 ${
                filter === 'movie'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              🎬 Filmler ({stats.movies})
            </button>
            <button
              onClick={() => setFilter('game')}
              className={`px-4 py-2 rounded-lg transition duration-200 ${
                filter === 'game'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              🎮 Oyunlar ({stats.games})
            </button>
          </div>
          
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ara..."
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
