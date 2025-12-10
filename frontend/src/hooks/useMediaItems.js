import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

export function useMediaItems() {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, 'media-items'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setMediaItems(items);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching media items:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addMediaItem = async (mediaData) => {
    try {
      await addDoc(collection(db, 'media-items'), {
        ...mediaData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error('Error adding media item:', err);
      throw err;
    }
  };

  const updateMediaItem = async (id, mediaData) => {
    try {
      const mediaRef = doc(db, 'media-items', id);
      await updateDoc(mediaRef, {
        ...mediaData,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error('Error updating media item:', err);
      throw err;
    }
  };

  const deleteMediaItem = async (id) => {
    try {
      await deleteDoc(doc(db, 'media-items', id));
    } catch (err) {
      console.error('Error deleting media item:', err);
      throw err;
    }
  };

  const updateMediaWithJikanData = async (id, jikanData) => {
    try {
      const mediaRef = doc(db, 'media-items', id);
      await updateDoc(mediaRef, {
        malId: jikanData.malId || null,
        originalTitle: jikanData.originalTitle || null,
        malScore: jikanData.malScore || null,
        synopsis: jikanData.synopsis || null,
        totalEpisodes: jikanData.totalEpisodes || null,
        airedFrom: jikanData.airedFrom || null,
        studios: jikanData.studios || null,
        genres: jikanData.genres || null,
        // Optionally update the image if Jikan has a better one and current is empty
        ...(jikanData.imageUrl && !jikanData.skipImageUpdate ? {
          imageUrl: jikanData.imageUrl,
          imageType: 'url'
        } : {}),
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error('Error updating media with Jikan data:', err);
      throw err;
    }
  };

  const incrementRewatch = async (mediaId) => {
    try {
      const mediaRef = doc(db, 'media-items', mediaId);
      const mediaDoc = await getDoc(mediaRef);
      
      if (!mediaDoc.exists()) {
        throw new Error('Media item not found');
      }
      
      const currentCount = mediaDoc.data().rewatchCount || 0;
      await updateDoc(mediaRef, { 
        rewatchCount: currentCount + 1,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error('Error incrementing rewatch count:', err);
      throw err;
    }
  };

  const decrementRewatch = async (mediaId) => {
    try {
      const mediaRef = doc(db, 'media-items', mediaId);
      const mediaDoc = await getDoc(mediaRef);
      
      if (!mediaDoc.exists()) {
        throw new Error('Media item not found');
      }
      
      const currentCount = mediaDoc.data().rewatchCount || 0;
      if (currentCount > 0) {
        await updateDoc(mediaRef, { 
          rewatchCount: currentCount - 1,
          updatedAt: serverTimestamp()
        });
      }
    } catch (err) {
      console.error('Error decrementing rewatch count:', err);
      throw err;
    }
  };

  return {
    mediaItems,
    loading,
    error,
    addMediaItem,
    updateMediaItem,
    deleteMediaItem,
    updateMediaWithJikanData,
    incrementRewatch,
    decrementRewatch
  };
}

