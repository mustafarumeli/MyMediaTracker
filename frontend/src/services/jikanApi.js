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

