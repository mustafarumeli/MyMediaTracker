import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useMediaItems } from './useMediaItems';
import { calculateAnimeStats } from '../utils/animeStats';

export function useAnimeStats() {
  const { mediaItems, loading: mediaLoading } = useMediaItems();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAndCalculateStats() {
      if (mediaLoading) return;

      try {
        setLoading(true);
        setError(null);

        // Filter only anime
        const animeItems = mediaItems.filter(item => item.category === 'Anime');

        if (animeItems.length === 0) {
          setStats(null);
          setLoading(false);
          return;
        }

        // Fetch episodes for each anime
        const episodesMap = {};
        
        for (const anime of animeItems) {
          try {
            const episodesRef = collection(db, `media-items/${anime.id}/episodes`);
            const episodesSnapshot = await getDocs(episodesRef);
            episodesMap[anime.id] = episodesSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
          } catch (err) {
            console.error(`Error fetching episodes for ${anime.id}:`, err);
            episodesMap[anime.id] = [];
          }
        }

        // Calculate statistics
        const calculatedStats = calculateAnimeStats(animeItems, episodesMap);
        setStats(calculatedStats);
      } catch (err) {
        console.error('Error calculating stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAndCalculateStats();
  }, [mediaItems, mediaLoading]);

  return { stats, loading, error };
}



