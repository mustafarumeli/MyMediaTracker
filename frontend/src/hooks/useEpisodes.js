import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

function useEpisodes(mediaId) {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  // Fetch episodes
  const fetchEpisodes = async () => {
    if (!currentUser || !mediaId) {
      setEpisodes([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const episodesRef = collection(db, `media-items/${mediaId}/episodes`);
      const q = query(episodesRef, orderBy('seasonNumber', 'asc'), orderBy('episodeNumber', 'asc'));
      const snapshot = await getDocs(q);
      
      const episodesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setEpisodes(episodesData);
    } catch (err) {
      console.error('Error fetching episodes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEpisodes();
  }, [currentUser, mediaId]);

  // Add episode
  const addEpisode = async (episodeData) => {
    if (!currentUser || !mediaId) return;

    try {
      const episodesRef = collection(db, `media-items/${mediaId}/episodes`);
      const docRef = await addDoc(episodesRef, {
        ...episodeData,
        createdAt: serverTimestamp()
      });
      
      await fetchEpisodes(); // Refresh list
      return docRef.id;
    } catch (err) {
      console.error('Error adding episode:', err);
      throw err;
    }
  };

  // Update episode
  const updateEpisode = async (episodeId, episodeData) => {
    if (!currentUser || !mediaId) return;

    try {
      const episodeRef = doc(db, `media-items/${mediaId}/episodes/${episodeId}`);
      await updateDoc(episodeRef, episodeData);
      
      await fetchEpisodes(); // Refresh list
    } catch (err) {
      console.error('Error updating episode:', err);
      throw err;
    }
  };

  // Delete episode
  const deleteEpisode = async (episodeId) => {
    if (!currentUser || !mediaId) return;

    try {
      const episodeRef = doc(db, `media-items/${mediaId}/episodes/${episodeId}`);
      await deleteDoc(episodeRef);
      
      await fetchEpisodes(); // Refresh list
    } catch (err) {
      console.error('Error deleting episode:', err);
      throw err;
    }
  };

  return {
    episodes,
    loading,
    error,
    addEpisode,
    updateEpisode,
    deleteEpisode,
    refreshEpisodes: fetchEpisodes
  };
}

export default useEpisodes;

