// TMDB (The Movie Database) API Service
// Get your API key from: https://www.themoviedb.org/settings/api

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

// Rate limiting
let lastRequestTime = 0;
const REQUEST_DELAY = 250; // 4 requests per second = 250ms between requests

async function rateLimitedFetch(url) {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < REQUEST_DELAY) {
    await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY - timeSinceLastRequest));
  }
  
  lastRequestTime = Date.now();
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Search for movies
 * @param {string} query - Search query
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} Search results
 */
export async function searchMovie(query, page = 1) {
  if (!TMDB_API_KEY) {
    console.warn('TMDB API key not configured');
    return { results: [], total_results: 0 };
  }

  const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=tr-TR&page=${page}`;
  
  try {
    return await rateLimitedFetch(url);
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
}

/**
 * Search for TV shows
 * @param {string} query - Search query
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} Search results
 */
export async function searchTV(query, page = 1) {
  if (!TMDB_API_KEY) {
    console.warn('TMDB API key not configured');
    return { results: [], total_results: 0 };
  }

  const url = `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=tr-TR&page=${page}`;
  
  try {
    return await rateLimitedFetch(url);
  } catch (error) {
    console.error('Error searching TV shows:', error);
    throw error;
  }
}

/**
 * Get movie details
 * @param {number} movieId - TMDB movie ID
 * @returns {Promise<Object>} Movie details
 */
export async function getMovieDetails(movieId) {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key not configured');
  }

  const url = `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=tr-TR&append_to_response=credits`;
  
  try {
    return await rateLimitedFetch(url);
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
}

/**
 * Get TV show details
 * @param {number} tvId - TMDB TV show ID
 * @returns {Promise<Object>} TV show details
 */
export async function getTVDetails(tvId) {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key not configured');
  }

  const url = `${TMDB_BASE_URL}/tv/${tvId}?api_key=${TMDB_API_KEY}&language=tr-TR&append_to_response=credits`;
  
  try {
    return await rateLimitedFetch(url);
  } catch (error) {
    console.error('Error fetching TV details:', error);
    throw error;
  }
}

/**
 * Get movie recommendations
 * @param {number} movieId - TMDB movie ID
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} Recommendations
 */
export async function getMovieRecommendations(movieId, page = 1) {
  if (!TMDB_API_KEY) {
    console.warn('TMDB API key not configured');
    return { results: [] };
  }

  const url = `${TMDB_BASE_URL}/movie/${movieId}/recommendations?api_key=${TMDB_API_KEY}&language=tr-TR&page=${page}`;
  
  try {
    return await rateLimitedFetch(url);
  } catch (error) {
    console.error('Error fetching movie recommendations:', error);
    return { results: [] };
  }
}

/**
 * Get TV show recommendations
 * @param {number} tvId - TMDB TV show ID
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} Recommendations
 */
export async function getTVRecommendations(tvId, page = 1) {
  if (!TMDB_API_KEY) {
    console.warn('TMDB API key not configured');
    return { results: [] };
  }

  const url = `${TMDB_BASE_URL}/tv/${tvId}/recommendations?api_key=${TMDB_API_KEY}&language=tr-TR&page=${page}`;
  
  try {
    return await rateLimitedFetch(url);
  } catch (error) {
    console.error('Error fetching TV recommendations:', error);
    return { results: [] };
  }
}

/**
 * Get popular movies
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} Popular movies
 */
export async function getPopularMovies(page = 1) {
  if (!TMDB_API_KEY) {
    console.warn('TMDB API key not configured');
    return { results: [] };
  }

  const url = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=tr-TR&page=${page}`;
  
  try {
    return await rateLimitedFetch(url);
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return { results: [] };
  }
}

/**
 * Get popular TV shows
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} Popular TV shows
 */
export async function getPopularTV(page = 1) {
  if (!TMDB_API_KEY) {
    console.warn('TMDB API key not configured');
    return { results: [] };
  }

  const url = `${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&language=tr-TR&page=${page}`;
  
  try {
    return await rateLimitedFetch(url);
  } catch (error) {
    console.error('Error fetching popular TV shows:', error);
    return { results: [] };
  }
}

/**
 * Convert TMDB movie data to our media format
 * @param {Object} tmdbMovie - TMDB movie object
 * @returns {Object} Media item in our format
 */
export function convertTMDBMovieToMedia(tmdbMovie) {
  return {
    title: tmdbMovie.title,
    originalTitle: tmdbMovie.original_title !== tmdbMovie.title ? tmdbMovie.original_title : null,
    category: 'Film',
    rating: 0, // User hasn't rated yet
    notes: tmdbMovie.overview || '',
    imageUrl: tmdbMovie.poster_path ? `${TMDB_IMAGE_BASE}${tmdbMovie.poster_path}` : null,
    imageType: 'url',
    tmdbId: tmdbMovie.id,
    malScore: tmdbMovie.vote_average || null,
    genres: tmdbMovie.genres ? tmdbMovie.genres.map(g => g.name) : (tmdbMovie.genre_ids ? [] : []),
    releaseDate: tmdbMovie.release_date || null,
    rewatchCount: 0
  };
}

/**
 * Convert TMDB TV data to our media format
 * @param {Object} tmdbTV - TMDB TV object
 * @returns {Object} Media item in our format
 */
export function convertTMDBTVToMedia(tmdbTV) {
  return {
    title: tmdbTV.name,
    originalTitle: tmdbTV.original_name !== tmdbTV.name ? tmdbTV.original_name : null,
    category: 'Dizi',
    rating: 0, // User hasn't rated yet
    notes: tmdbTV.overview || '',
    imageUrl: tmdbTV.poster_path ? `${TMDB_IMAGE_BASE}${tmdbTV.poster_path}` : null,
    imageType: 'url',
    tmdbId: tmdbTV.id,
    malScore: tmdbTV.vote_average || null,
    genres: tmdbTV.genres ? tmdbTV.genres.map(g => g.name) : (tmdbTV.genre_ids ? [] : []),
    releaseDate: tmdbTV.first_air_date || null,
    totalEpisodes: tmdbTV.number_of_episodes || null,
    rewatchCount: 0
  };
}

/**
 * Get trending items (movies + TV)
 * @param {string} timeWindow - 'day' or 'week'
 * @returns {Promise<Array>} Trending items in our format
 */
export async function getTrending(timeWindow = 'week') {
  if (!TMDB_API_KEY) {
    console.warn('TMDB API key not configured');
    return [];
  }

  const url = `${TMDB_BASE_URL}/trending/all/${timeWindow}?api_key=${TMDB_API_KEY}&language=tr-TR`;
  
  try {
    const data = await rateLimitedFetch(url);
    return data.results.map(item => {
      if (item.media_type === 'movie') {
        return { ...convertTMDBMovieToMedia(item), media_type: 'movie' };
      } else if (item.media_type === 'tv') {
        return { ...convertTMDBTVToMedia(item), media_type: 'tv' };
      }
      return null;
    }).filter(Boolean);
  } catch (error) {
    console.error('Error fetching trending:', error);
    return [];
  }
}

