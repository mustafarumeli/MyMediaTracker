import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useMediaItems } from '../hooks/useMediaItems';
import { useRecommendations } from '../hooks/useRecommendations';
import MediaForm from './MediaForm';
import MediaList from './MediaList';
import MediaTable from './MediaTable';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import RecommendationWidget from './RecommendationWidget';
import { exportMediaData } from '../utils/exportData';
import { autoMigrateRewatchCount } from '../utils/migrateRewatchCount';

function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { mediaItems, loading, addMediaItem, updateMediaItem, deleteMediaItem } = useMediaItems();
  const { recommendations, loading: recsLoading, refresh: refreshRecs } = useRecommendations(mediaItems);
  const [editingItem, setEditingItem] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('viewMode') || 'grid';
  });
  const [exporting, setExporting] = useState(false);
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, highest, lowest, az, za
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, media: null });
  const [deleting, setDeleting] = useState(false);

  // Save view mode to localStorage
  useEffect(() => {
    localStorage.setItem('viewMode', viewMode);
  }, [viewMode]);

  // Auto-migrate rewatchCount field for existing media items
  useEffect(() => {
    if (!loading && mediaItems.length > 0) {
      autoMigrateRewatchCount().then(result => {
        if (result.success && result.migrated > 0) {
          console.log(`Migrated ${result.migrated} media items with rewatchCount field`);
        }
      });
    }
  }, [loading, mediaItems.length]);

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
      toast.success(`${result.count} medya başarıyla export edildi! 💾\nDosya: ${result.filename}`, {
        duration: 4000,
        position: 'bottom-right'
      });
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export sırasında bir hata oluştu.', {
        duration: 3000,
        position: 'bottom-right'
      });
    } finally {
      setExporting(false);
    }
  }

  async function handleAddMedia(mediaData) {
    try {
      await addMediaItem(mediaData);
      setShowForm(false);
      toast.success(`${mediaData.title} başarıyla eklendi! ✨`, {
        duration: 3000,
        position: 'bottom-right'
      });
    } catch (error) {
      console.error('Add error:', error);
      toast.error('Medya eklenirken bir hata oluştu.', {
        duration: 3000,
        position: 'bottom-right'
      });
    }
  }

  async function handleAddRecommendation(recommendation) {
    try {
      // Remove source and reason fields before adding
      const { source, reason, relevanceScore, ...mediaData } = recommendation;
      
      await addMediaItem(mediaData);
      
      // Refresh recommendations after adding
      setTimeout(() => refreshRecs(), 1000);
    } catch (error) {
      console.error('Add recommendation error:', error);
      throw error;
    }
  }

  async function handleUpdateMedia(mediaData) {
    if (editingItem) {
      try {
        await updateMediaItem(editingItem.id, mediaData);
        setEditingItem(null);
        setShowForm(false);
        toast.success(`${mediaData.title} güncellendi! 🔄`, {
          duration: 3000,
          position: 'bottom-right'
        });
      } catch (error) {
        console.error('Update error:', error);
        toast.error('Medya güncellenirken bir hata oluştu.', {
          duration: 3000,
          position: 'bottom-right'
        });
      }
    }
  }

  function handleDeleteMedia(id) {
    const media = mediaItems.find(item => item.id === id);
    setDeleteModal({ isOpen: true, media });
  }

  async function confirmDelete() {
    if (!deleteModal.media) return;
    
    setDeleting(true);
    try {
      await deleteMediaItem(deleteModal.media.id);
      toast.success(`${deleteModal.media.title} silindi! 🗑️`, {
        duration: 3000,
        position: 'bottom-right'
      });
      setDeleteModal({ isOpen: false, media: null });
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Medya silinirken bir hata oluştu.', {
        duration: 3000,
        position: 'bottom-right'
      });
    } finally {
      setDeleting(false);
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

  // Sort media
  const sortedMedia = useMemo(() => {
    const sorted = [...filteredMedia];
    
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      case 'oldest':
        return sorted.sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
      case 'highest':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'lowest':
        return sorted.sort((a, b) => (a.rating || 0) - (b.rating || 0));
      case 'az':
        return sorted.sort((a, b) => a.title.localeCompare(b.title, 'tr'));
      case 'za':
        return sorted.sort((a, b) => b.title.localeCompare(a.title, 'tr'));
      default:
        return sorted;
    }
  }, [filteredMedia, sortBy]);

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
      {/* Toast Container */}
      <Toaster
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #FFB800',
            borderRadius: '8px',
          },
          success: {
            iconTheme: {
              primary: '#FFB800',
              secondary: '#1a1a1a',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#1a1a1a',
            },
          },
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, media: null })}
        onConfirm={confirmDelete}
        media={deleteModal.media}
        loading={deleting}
      />

      {/* Navigation */}
      <nav className="bg-dark-950 shadow-glow border-b-2 border-gold">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="Logo" className="w-10 h-10 drop-shadow-[0_0_10px_rgba(255,184,0,0.5)]" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">Medya Takip Sistemim</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/stats')}
              className="bg-dark-900 hover:bg-gold/20 border border-gold text-gold px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-glow-sm flex items-center gap-2"
              title="Anime İstatistikleri"
            >
              <span>📊</span>
              <span className="hidden sm:inline">İstatistikler</span>
            </button>
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

        {/* Filter, Sort and Search */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-2 items-center justify-between">
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
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
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

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
              <label className="text-gray-400 text-sm">Sırala:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-dark-900 border border-gold/30 rounded-lg text-white focus:outline-none focus:border-gold transition-colors"
              >
                <option value="newest">📅 En Yeni</option>
                <option value="oldest">📅 En Eski</option>
                <option value="highest">⭐ En Yüksek Puan</option>
                <option value="lowest">⭐ En Düşük Puan</option>
                <option value="az">🔤 A-Z</option>
                <option value="za">🔤 Z-A</option>
              </select>
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

        {/* Recommendation Widget */}
        {!loading && mediaItems.filter(item => item.rating > 0).length >= 5 && (
          <RecommendationWidget
            recommendations={recommendations}
            loading={recsLoading}
            onRefresh={refreshRecs}
            onAddRecommendation={handleAddRecommendation}
          />
        )}

        {/* Media List/Table */}
        {viewMode === 'grid' ? (
          <MediaList
            media={sortedMedia}
            loading={loading}
            onDelete={handleDeleteMedia}
            onEdit={handleEditMedia}
          />
        ) : (
          <MediaTable
            mediaItems={sortedMedia}
            onDelete={handleDeleteMedia}
            onEdit={handleEditMedia}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
