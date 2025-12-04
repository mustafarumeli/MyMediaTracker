import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Check if an anime with the given MAL ID already exists in the database
 * @param {number} malId - MyAnimeList ID
 * @param {string|null} currentMediaId - Current media ID to exclude from check (for updates)
 * @returns {Promise<Object|null>} - Returns the duplicate media item if found, null otherwise
 */
export async function checkDuplicateAnime(malId, currentMediaId = null) {
  if (!malId) {
    return null;
  }

  try {
    const mediaRef = collection(db, 'media-items');
    const q = query(mediaRef, where('malId', '==', malId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    // If we're updating the current media, exclude it from duplicate check
    const duplicates = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(item => item.id !== currentMediaId);

    return duplicates.length > 0 ? duplicates[0] : null;
  } catch (error) {
    console.error('Error checking for duplicates:', error);
    throw error;
  }
}

