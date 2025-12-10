const JIKAN_API_BASE = 'https://api.jikan.moe/v4';

// Rate limiting helper
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 334; // ~3 requests per second

async function waitForRateLimit() {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  lastRequestTime = Date.now();
}

/**
 * Search for anime by title
 * @param {string} query - Search query
 * @returns {Promise<Array>} - Array of anime results
 */
export async function searchAnime(query) {
  if (!query || query.trim().length === 0) {
    throw new Error('Search query cannot be empty');
  }

  try {
    await waitForRateLimit();
    
    const response = await fetch(
      `${JIKAN_API_BASE}/anime?q=${encodeURIComponent(query)}&limit=10&order_by=popularity&sort=asc`
    );

    if (!response.ok) {
      throw new Error(`Jikan API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.data.map(anime => ({
      malId: anime.mal_id,
      title: anime.title,
      titleEnglish: anime.title_english,
      titleJapanese: anime.title_japanese,
      score: anime.score,
      imageUrl: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url,
      episodes: anime.episodes,
      year: anime.aired?.prop?.from?.year,
      type: anime.type // TV, Movie, OVA, etc.
    }));
  } catch (error) {
    console.error('Error searching anime:', error);
    throw error;
  }
}

/**
 * Get detailed anime information by MAL ID
 * @param {number} malId - MyAnimeList ID
 * @returns {Promise<Object>} - Detailed anime information
 */
export async function getAnimeDetails(malId) {
  if (!malId) {
    throw new Error('MAL ID is required');
  }

  try {
    await waitForRateLimit();
    
    const response = await fetch(`${JIKAN_API_BASE}/anime/${malId}/full`);

    if (!response.ok) {
      throw new Error(`Jikan API error: ${response.status}`);
    }

    const result = await response.json();
    const anime = result.data;

    return {
      malId: anime.mal_id,
      title: anime.title,
      originalTitle: anime.title_japanese || anime.title,
      titleEnglish: anime.title_english,
      malScore: anime.score,
      synopsis: anime.synopsis,
      totalEpisodes: anime.episodes,
      airedFrom: anime.aired?.from,
      studios: anime.studios?.map(s => s.name) || [],
      genres: anime.genres?.map(g => g.name) || [],
      imageUrl: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url,
      type: anime.type,
      status: anime.status,
      year: anime.aired?.prop?.from?.year,
      rating: anime.rating // Age rating (G, PG, PG-13, etc.)
    };
  } catch (error) {
    console.error('Error fetching anime details:', error);
    throw error;
  }
}

/**
 * Get anime recommendations based on MAL ID
 * @param {number} malId - MyAnimeList ID
 * @param {number} limit - Maximum number of recommendations (default: 10)
 * @returns {Promise<Array>} - Array of recommended anime
 */
export async function getAnimeRecommendations(malId, limit = 10) {
  if (!malId) {
    throw new Error('MAL ID is required');
  }

  try {
    await waitForRateLimit();
    
    const response = await fetch(`${JIKAN_API_BASE}/anime/${malId}/recommendations`);

    if (!response.ok) {
      throw new Error(`Jikan API error: ${response.status}`);
    }

    const result = await response.json();
    
    return result.data.slice(0, limit).map(rec => ({
      malId: rec.entry.mal_id,
      title: rec.entry.title,
      imageUrl: rec.entry.images?.jpg?.large_image_url || rec.entry.images?.jpg?.image_url,
      votes: rec.votes
    }));
  } catch (error) {
    console.error('Error fetching anime recommendations:', error);
    return [];
  }
}

/**
 * Get seasonal anime (current or specific season)
 * @param {number} year - Year (e.g., 2024)
 * @param {string} season - 'winter', 'spring', 'summer', or 'fall'
 * @param {number} limit - Maximum number of results (default: 25)
 * @returns {Promise<Array>} - Array of seasonal anime
 */
export async function getSeasonalAnime(year, season, limit = 25) {
  try {
    await waitForRateLimit();
    
    const response = await fetch(
      `${JIKAN_API_BASE}/seasons/${year}/${season}?limit=${limit}&order_by=popularity&sort=asc`
    );

    if (!response.ok) {
      throw new Error(`Jikan API error: ${response.status}`);
    }

    const result = await response.json();
    
    return result.data.map(anime => ({
      malId: anime.mal_id,
      title: anime.title,
      originalTitle: anime.title_japanese || anime.title,
      malScore: anime.score,
      imageUrl: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url,
      genres: anime.genres?.map(g => g.name) || [],
      studios: anime.studios?.map(s => s.name) || [],
      synopsis: anime.synopsis,
      totalEpisodes: anime.episodes,
      type: anime.type,
      year: anime.year
    }));
  } catch (error) {
    console.error('Error fetching seasonal anime:', error);
    return [];
  }
}

/**
 * Get current season anime
 * @param {number} limit - Maximum number of results (default: 25)
 * @returns {Promise<Array>} - Array of current season anime
 */
export async function getCurrentSeasonAnime(limit = 25) {
  try {
    await waitForRateLimit();
    
    const response = await fetch(
      `${JIKAN_API_BASE}/seasons/now?limit=${limit}&order_by=popularity&sort=asc`
    );

    if (!response.ok) {
      throw new Error(`Jikan API error: ${response.status}`);
    }

    const result = await response.json();
    
    return result.data.map(anime => ({
      malId: anime.mal_id,
      title: anime.title,
      originalTitle: anime.title_japanese || anime.title,
      malScore: anime.score,
      imageUrl: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url,
      genres: anime.genres?.map(g => g.name) || [],
      studios: anime.studios?.map(s => s.name) || [],
      synopsis: anime.synopsis,
      totalEpisodes: anime.episodes,
      type: anime.type,
      year: anime.year
    }));
  } catch (error) {
    console.error('Error fetching current season anime:', error);
    return [];
  }
}

/**
 * Get top anime
 * @param {string} type - 'tv', 'movie', 'ova', etc. (optional)
 * @param {number} limit - Maximum number of results (default: 25)
 * @returns {Promise<Array>} - Array of top anime
 */
export async function getTopAnime(type = null, limit = 25) {
  try {
    await waitForRateLimit();
    
    const typeParam = type ? `&type=${type}` : '';
    const response = await fetch(
      `${JIKAN_API_BASE}/top/anime?limit=${limit}${typeParam}`
    );

    if (!response.ok) {
      throw new Error(`Jikan API error: ${response.status}`);
    }

    const result = await response.json();
    
    return result.data.map(anime => ({
      malId: anime.mal_id,
      title: anime.title,
      originalTitle: anime.title_japanese || anime.title,
      malScore: anime.score,
      imageUrl: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url,
      genres: anime.genres?.map(g => g.name) || [],
      studios: anime.studios?.map(s => s.name) || [],
      synopsis: anime.synopsis,
      totalEpisodes: anime.episodes,
      type: anime.type,
      year: anime.year
    }));
  } catch (error) {
    console.error('Error fetching top anime:', error);
    return [];
  }
}

/**
 * Convert Jikan anime data to our media format
 * @param {Object} jikanAnime - Jikan anime object
 * @returns {Object} Media item in our format
 */
export function convertJikanAnimeToMedia(jikanAnime) {
  return {
    title: jikanAnime.title,
    originalTitle: jikanAnime.originalTitle || jikanAnime.title,
    category: 'Anime',
    rating: 0, // User hasn't rated yet
    notes: jikanAnime.synopsis || '',
    imageUrl: jikanAnime.imageUrl || null,
    imageType: 'url',
    malId: jikanAnime.malId,
    malScore: jikanAnime.malScore || null,
    genres: jikanAnime.genres || [],
    studios: jikanAnime.studios || [],
    totalEpisodes: jikanAnime.totalEpisodes || null,
    airedFrom: jikanAnime.airedFrom || null,
    rewatchCount: 0
  };
}

