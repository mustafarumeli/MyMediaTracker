import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMediaItems } from '../hooks/useMediaItems';
import MediaForm from './MediaForm';
import MediaList from './MediaList';
import MediaTable from './MediaTable';
import { exportMediaData } from '../utils/exportData';

function Dashboard() {
  const { currentUser, logout } = useAuth();
  const { mediaItems, loading, addMediaItem, updateMediaItem, deleteMediaItem } = useMediaItems();
  const [editingItem, setEditingItem] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('viewMode') || 'grid';
  });
  const [exporting, setExporting] = useState(false);

  // Save view mode to localStorage
  useEffect(() => {
    localStorage.setItem('viewMode', viewMode);
  }, [viewMode]);

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async function handleExport() {
    try {
      setExporting(true);
      const result = await exportMediaData(currentUser);
      alert(`✅ ${result.count} medya başarıyla export edildi!\nDosya: ${result.filename}`);
    } catch (error) {
      console.error('Export error:', error);
      alert('❌ Export sırasında bir hata oluştu.');
    } finally {
      setExporting(false);
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
    <div className="min-h-screen bg-dark-950 text-white">
      {/* Navigation */}
      <nav className="bg-dark-950 shadow-glow border-b-2 border-gold">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="Logo" className="w-10 h-10 drop-shadow-[0_0_10px_rgba(255,184,0,0.5)]" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">Medya Takip Sistemim</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleExport}
              disabled={exporting || mediaItems.length === 0}
              className="bg-dark-900 hover:bg-gold/20 border border-gold text-gold px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-glow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              title="JSON Export"
            >
              <span>💾</span>
              <span className="hidden sm:inline">{exporting ? 'Export...' : 'Export'}</span>
            </button>
            <span className="text-gold hidden sm:block">{currentUser?.email}</span>
            <button
              onClick={handleLogout}
              className="bg-dark-900 hover:bg-dark-850 border border-red-500 text-red-400 hover:text-red-300 px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-dark-900 border border-gold/30 rounded-lg p-4 hover:border-gold hover:shadow-glow-sm transition-all duration-300">
            <div className="text-gray-400 text-sm">Toplam</div>
            <div className="text-3xl font-bold text-gold">{stats.total}</div>
          </div>
          {categories.slice(0, 2).map((cat) => (
            <div key={cat} className="bg-dark-900 border border-gold/30 rounded-lg p-4 hover:border-gold hover:shadow-glow-sm transition-all duration-300">
              <div className="text-gray-400 text-sm">{cat}</div>
              <div className="text-3xl font-bold text-gold">{categoryStats[cat]}</div>
            </div>
          ))}
          <div className="bg-dark-900 border border-gold/30 rounded-lg p-4 hover:border-gold hover:shadow-glow-sm transition-all duration-300">
            <div className="text-gray-400 text-sm">Ortalama Puan</div>
            <div className="text-3xl font-bold text-gold">{stats.avgRating}</div>
          </div>
        </div>

        {/* Add New Button (Collapsible) */}
        <div className="mb-8">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg"
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
                  className="w-full mt-4 btn-secondary py-3"
                >
                  ✕ Kapat
                </button>
              )}
            </div>
          )}
        </div>

        {/* Filter and Search */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            {/* Category Filters */}
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                filter === 'all'
                  ? 'bg-gold text-black font-bold shadow-glow'
                  : 'bg-dark-900 border border-gold/30 text-gold hover:border-gold hover:shadow-glow-sm'
              }`}
            >
              Tümü ({mediaItems.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  filter === cat
                    ? 'bg-gold text-black font-bold shadow-glow'
                    : 'bg-dark-900 border border-gold/30 text-gold hover:border-gold hover:shadow-glow-sm'
                }`}
              >
                {cat} ({categoryStats[cat]})
              </button>
            ))}

            {/* View Mode Toggle */}
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                  viewMode === 'grid'
                    ? 'bg-gold text-black font-bold shadow-glow'
                    : 'bg-dark-900 border border-gold/30 text-gold hover:border-gold hover:shadow-glow-sm'
                }`}
                title="Grid View"
              >
                <span>🔲</span>
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                  viewMode === 'list'
                    ? 'bg-gold text-black font-bold shadow-glow'
                    : 'bg-dark-900 border border-gold/30 text-gold hover:border-gold hover:shadow-glow-sm'
                }`}
                title="List View"
              >
                <span>📋</span>
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
          </div>
          
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !showForm) {
                setShowForm(true);
                setTimeout(() => {
                  // Form açıldıktan sonra ilk input'a focus
                  const firstInput = document.querySelector('input[type="text"]');
                  if (firstInput) firstInput.focus();
                }, 100);
              }
            }}
          placeholder="🔍 Ara... (Enter = Yeni Ekle)"
          className="w-full px-4 py-3 bg-dark-900 border border-gold/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:shadow-glow-sm transition-all duration-300"
          />
        </div>

        {/* Media List/Table */}
        {viewMode === 'grid' ? (
          <MediaList
            media={filteredMedia}
            loading={loading}
            onDelete={handleDeleteMedia}
            onEdit={handleEditMedia}
          />
        ) : (
          <MediaTable
            mediaItems={filteredMedia}
            onDelete={handleDeleteMedia}
            onEdit={handleEditMedia}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
