import { useState, useEffect, useCallback } from 'react';
import { getRecommendations } from '../utils/recommendationEngine';
import { getCurrentSeasonAnime, getTopAnime, convertJikanAnimeToMedia } from '../services/jikanApi';
import { getTrending, convertTMDBMovieToMedia, convertTMDBTVToMedia } from '../services/tmdbApi';

/**
 * Custom hook for generating recommendations
 * @param {Array} mediaItems - User's media collection
 * @returns {Object} - { recommendations, loading, refresh, error }
 */
export function useRecommendations(mediaItems) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  const CACHE_KEY = 'recommendations_cache';
  const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  /**
   * Load recommendations from localStorage cache
   */
  const loadFromCache = useCallback(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();
        
        // Check if cache is still valid
        if (now - timestamp < CACHE_DURATION) {
          setRecommendations(data);
          setLastRefresh(new Date(timestamp));
          return true;
        }
      }
    } catch (err) {
      console.error('Error loading cache:', err);
    }
    return false;
  }, []);

  /**
   * Save recommendations to localStorage cache
   */
  const saveToCache = useCallback((data) => {
    try {
      const timestamp = Date.now();
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp }));
      setLastRefresh(new Date(timestamp));
    } catch (err) {
      console.error('Error saving cache:', err);
    }
  }, []);

  /**
   * Fetch external recommendations from APIs
   */
  const fetchExternalRecommendations = async () => {
    const externalItems = [];

    try {
      // Fetch anime recommendations
      const animePromises = [
        getCurrentSeasonAnime(10).catch(() => []),
        getTopAnime('tv', 10).catch(() => [])
      ];

      const [seasonalAnime, topAnime] = await Promise.all(animePromises);
      
      // Convert and add anime
      seasonalAnime.forEach(anime => {
        externalItems.push(convertJikanAnimeToMedia(anime));
      });
      
      topAnime.forEach(anime => {
        // Avoid duplicates
        if (!externalItems.some(item => item.malId === anime.malId)) {
          externalItems.push(convertJikanAnimeToMedia(anime));
        }
      });

      // Fetch movies and TV shows from TMDB
      try {
        const trending = await getTrending('week');
        
        trending.forEach(item => {
          if (item.media_type === 'movie') {
            externalItems.push({
              ...item,
              category: 'Film'
            });
          } else if (item.media_type === 'tv') {
            externalItems.push({
              ...item,
              category: 'Dizi'
            });
          }
        });
      } catch (tmdbError) {
        console.warn('TMDB not configured or error:', tmdbError);
      }

    } catch (err) {
      console.error('Error fetching external recommendations:', err);
    }

    return externalItems;
  };

  /**
   * Generate recommendations
   */
  const generateRecommendations = useCallback(async (forceRefresh = false) => {
    // Check if we need recommendations
    const ratedItems = mediaItems.filter(item => item.rating && item.rating > 0);
    if (ratedItems.length < 5) {
      setRecommendations([]);
      setLoading(false);
      return;
    }

    // Try to load from cache first (only if not forcing refresh)
    if (!forceRefresh && loadFromCache()) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch external items
      const externalItems = await fetchExternalRecommendations();

      // Generate recommendations using our algorithm
      const recs = getRecommendations(mediaItems, externalItems, 6);

      setRecommendations(recs);
      saveToCache(recs);
    } catch (err) {
      console.error('Error generating recommendations:', err);
      setError(err.message);
      
      // If error, try to show cached recommendations anyway
      loadFromCache();
    } finally {
      setLoading(false);
    }
  }, [mediaItems, loadFromCache, saveToCache]);

  /**
   * Refresh recommendations
   */
  const refresh = useCallback(() => {
    generateRecommendations(true);
  }, [generateRecommendations]);

  /**
   * Auto-generate recommendations when media items change significantly
   */
  useEffect(() => {
    const ratedItems = mediaItems.filter(item => item.rating && item.rating > 0);
    
    // Only generate if user has enough rated items
    if (ratedItems.length >= 5) {
      // Check if we need to refresh based on cache
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const { timestamp } = JSON.parse(cached);
          const timeSinceRefresh = Date.now() - timestamp;
          
          // Auto-refresh if cache is old or if user added many new items
          if (timeSinceRefresh > CACHE_DURATION) {
            generateRecommendations(false);
          } else {
            // Just load from cache
            loadFromCache();
            setLoading(false);
          }
        } catch {
          generateRecommendations(false);
        }
      } else {
        generateRecommendations(false);
      }
    } else {
      setRecommendations([]);
      setLoading(false);
    }
  }, [mediaItems.length]); // Only re-run when collection size changes

  return {
    recommendations,
    loading,
    refresh,
    error,
    lastRefresh
  };
}

