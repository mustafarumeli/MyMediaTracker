import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
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

  return {
    mediaItems,
    loading,
    error,
    addMediaItem,
    updateMediaItem,
    deleteMediaItem
  };
}

