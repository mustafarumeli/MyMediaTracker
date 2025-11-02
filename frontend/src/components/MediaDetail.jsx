import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import useEpisodes from '../hooks/useEpisodes';
import StarRating from './StarRating';
import EpisodeForm from './EpisodeForm';
import EpisodeList from './EpisodeList';

const CATEGORY_EMOJIS = {
  'Film': '🎬',
  'Dizi': '📺',
  'Anime': '🎌',
  'Oyun': '🎮'
};

function MediaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState(null);
  
  const { 
    episodes, 
    loading: episodesLoading, 
    addEpisode, 
    updateEpisode, 
    deleteEpisode 
  } = useEpisodes(id);

  // Fetch media data
  useEffect(() => {
    async function fetchMedia() {
      if (!currentUser || !id) return;

      try {
        setLoading(true);
        const mediaRef = doc(db, `media-items/${id}`);
        const mediaSnap = await getDoc(mediaRef);
        
        if (mediaSnap.exists()) {
          setMedia({ id: mediaSnap.id, ...mediaSnap.data() });
        } else {
          alert('Medya bulunamadı');
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching media:', error);
        alert('Bir hata oluştu');
        navigate('/');
      } finally {
        setLoading(false);
      }
    }

    fetchMedia();
  }, [currentUser, id, navigate]);

  const handleAddEpisode = async (episodeData) => {
    try {
      await addEpisode(episodeData);
      setShowForm(false);
    } catch (error) {
      console.error('Error adding episode:', error);
      alert('Bölüm eklenirken bir hata oluştu');
    }
  };

  const handleUpdateEpisode = async (episodeData) => {
    if (!editingEpisode) return;
    
    try {
      await updateEpisode(editingEpisode.id, episodeData);
      setEditingEpisode(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating episode:', error);
      alert('Bölüm güncellenirken bir hata oluştu');
    }
  };

  const handleEditEpisode = (episode) => {
    setEditingEpisode(episode);
    setShowForm(true);
  };

  const handleDeleteEpisode = async (episodeId) => {
    try {
      await deleteEpisode(episodeId);
    } catch (error) {
      console.error('Error deleting episode:', error);
      alert('Bölüm silinirken bir hata oluştu');
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingEpisode(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-gold text-xl">Yükleniyor...</div>
      </div>
    );
  }

  if (!media) {
    return null;
  }

  const categoryEmoji = CATEGORY_EMOJIS[media.category] || '📁';

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      {/* Header */}
      <nav className="bg-dark-950 shadow-glow border-b-2 border-gold">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors duration-200"
          >
            <span className="text-2xl">←</span>
            <span className="font-semibold">Dashboard'a Dön</span>
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Media Info Card */}
        <div className="bg-dark-900 border-2 border-gold rounded-lg overflow-hidden shadow-glow-lg mb-8">
          <div className="md:flex">
            {/* Poster */}
            {media.imageUrl ? (
              <div className="md:w-1/3 h-64 md:h-auto">
                <img
                  src={media.imageUrl}
                  alt={media.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="md:w-1/3 h-64 md:h-auto bg-dark-850 flex items-center justify-center">
                <span className="text-8xl">{categoryEmoji}</span>
              </div>
            )}

            {/* Info */}
            <div className="md:w-2/3 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="text-sm text-gray-400 mb-2">
                    {categoryEmoji} {media.category}
                  </div>
                  <h1 className="text-4xl font-bold text-gold mb-4">
                    {media.title}
                  </h1>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-2">Genel Puan</div>
                <StarRating value={media.rating} readonly size="lg" />
              </div>

              {media.notes && (
                <div>
                  <div className="text-sm text-gray-400 mb-2">Notlar</div>
                  <p className="text-gray-300">{media.notes}</p>
                </div>
              )}

              {episodes.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gold/30">
                  <div className="text-sm text-gray-400">İstatistikler</div>
                  <div className="mt-2 flex gap-6">
                    <div>
                      <div className="text-2xl font-bold text-gold">{episodes.length}</div>
                      <div className="text-sm text-gray-400">Toplam Bölüm</div>
                    </div>
                    {episodes.some(ep => ep.rating > 0) && (
                      <div>
                        <div className="text-2xl font-bold text-gold">
                          {(episodes.reduce((sum, ep) => sum + (ep.rating || 0), 0) / episodes.filter(ep => ep.rating > 0).length).toFixed(1)}
                        </div>
                        <div className="text-sm text-gray-400">Bölüm Ortalaması</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Episodes Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gold">
              📝 Bölümler
            </h2>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary py-3 px-6 flex items-center gap-2"
              >
                <span className="text-xl">➕</span>
                <span>Yeni Bölüm Ekle</span>
              </button>
            )}
          </div>

          {/* Episode Form */}
          {showForm && (
            <div className="mb-6 animate-fadeIn">
              <EpisodeForm
                onSubmit={editingEpisode ? handleUpdateEpisode : handleAddEpisode}
                onCancel={handleCancelForm}
                initialData={editingEpisode}
              />
            </div>
          )}

          {/* Episodes List */}
          {episodesLoading ? (
            <div className="text-center py-12 text-gray-400">
              Bölümler yükleniyor...
            </div>
          ) : (
            <EpisodeList
              episodes={episodes}
              onEdit={handleEditEpisode}
              onDelete={handleDeleteEpisode}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default MediaDetail;

