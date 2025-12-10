// Recommendation Engine - Hybrid algorithm combining user preferences with external APIs

/**
 * Analyze user preferences based on their media items and ratings
 * @param {Array} mediaItems - User's media collection
 * @returns {Object} Preference profile
 */
export function analyzeUserPreferences(mediaItems) {
  // Filter items with ratings >= 7 (considered "liked")
  const likedItems = mediaItems.filter(item => item.rating >= 7);
  
  if (likedItems.length === 0) {
    return {
      preferredGenres: {},
      preferredStudios: {},
      preferredCategories: {},
      avgRating: 0,
      totalItems: 0
    };
  }

  // Calculate genre weights
  const genreWeights = {};
  likedItems.forEach(item => {
    if (item.genres && Array.isArray(item.genres)) {
      item.genres.forEach(genre => {
        if (!genreWeights[genre]) {
          genreWeights[genre] = { count: 0, totalRating: 0 };
        }
        genreWeights[genre].count++;
        genreWeights[genre].totalRating += item.rating;
      });
    }
  });

  // Calculate studio weights (for anime)
  const studioWeights = {};
  likedItems.forEach(item => {
    if (item.studios && Array.isArray(item.studios)) {
      item.studios.forEach(studio => {
        if (!studioWeights[studio]) {
          studioWeights[studio] = { count: 0, totalRating: 0 };
        }
        studioWeights[studio].count++;
        studioWeights[studio].totalRating += item.rating;
      });
    }
  });

  // Calculate category weights
  const categoryWeights = {};
  likedItems.forEach(item => {
    if (!categoryWeights[item.category]) {
      categoryWeights[item.category] = { count: 0, totalRating: 0 };
    }
    categoryWeights[item.category].count++;
    categoryWeights[item.category].totalRating += item.rating;
  });

  // Calculate average rating
  const avgRating = likedItems.reduce((sum, item) => sum + item.rating, 0) / likedItems.length;

  return {
    preferredGenres: genreWeights,
    preferredStudios: studioWeights,
    preferredCategories: categoryWeights,
    avgRating,
    totalItems: likedItems.length
  };
}

/**
 * Generate recommendations from user's own database
 * @param {Array} mediaItems - User's media collection
 * @param {Object} preferences - User preference profile
 * @returns {Array} Recommended items from own collection
 */
export function generateOwnRecommendations(mediaItems, preferences) {
  // Filter out items user has already rated highly
  const candidates = mediaItems.filter(item => !item.rating || item.rating < 7);
  
  if (candidates.length === 0) return [];

  const recommendations = candidates.map(item => {
    const score = calculateRelevanceScore(item, preferences);
    return {
      ...item,
      relevanceScore: score,
      reason: getRecommendationReason(item, preferences),
      source: 'own'
    };
  });

  // Sort by relevance and return top items
  return recommendations
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 3);
}

/**
 * Calculate relevance score for an item based on user preferences
 * @param {Object} item - Media item
 * @param {Object} preferences - User preference profile
 * @returns {number} Relevance score (0-100)
 */
export function calculateRelevanceScore(item, preferences) {
  let score = 0;
  let weights = 0;

  // Genre match (30% weight)
  if (item.genres && Array.isArray(item.genres)) {
    let genreScore = 0;
    item.genres.forEach(genre => {
      if (preferences.preferredGenres[genre]) {
        const genreData = preferences.preferredGenres[genre];
        genreScore += (genreData.count / preferences.totalItems) * (genreData.totalRating / genreData.count / 10);
      }
    });
    score += (genreScore / Math.max(item.genres.length, 1)) * 30;
    weights += 30;
  }

  // Studio match (20% weight) - only for anime
  if (item.category === 'Anime' && item.studios && Array.isArray(item.studios)) {
    let studioScore = 0;
    item.studios.forEach(studio => {
      if (preferences.preferredStudios[studio]) {
        const studioData = preferences.preferredStudios[studio];
        studioScore += (studioData.count / preferences.totalItems) * (studioData.totalRating / studioData.count / 10);
      }
    });
    score += (studioScore / Math.max(item.studios.length, 1)) * 20;
    weights += 20;
  }

  // MAL score proximity (25% weight) - prefer items with high MAL scores
  if (item.malScore) {
    const malProximity = Math.abs(item.malScore - preferences.avgRating) / 10;
    score += (1 - malProximity) * 25;
    weights += 25;
  }

  // Category match (25% weight)
  if (preferences.preferredCategories[item.category]) {
    const categoryData = preferences.preferredCategories[item.category];
    const categoryScore = (categoryData.count / preferences.totalItems) * (categoryData.totalRating / categoryData.count / 10);
    score += categoryScore * 25;
    weights += 25;
  }

  // Normalize score to 0-100 range
  return weights > 0 ? (score / weights) * 100 : 0;
}

/**
 * Get a human-readable reason for recommending an item
 * @param {Object} item - Media item
 * @param {Object} preferences - User preference profile
 * @returns {string} Recommendation reason
 */
function getRecommendationReason(item, preferences) {
  const reasons = [];

  // Check genre match
  if (item.genres && Array.isArray(item.genres)) {
    const matchedGenres = item.genres.filter(g => preferences.preferredGenres[g]);
    if (matchedGenres.length > 0) {
      reasons.push(`Sevdiğin tür: ${matchedGenres[0]}`);
    }
  }

  // Check studio match
  if (item.studios && Array.isArray(item.studios)) {
    const matchedStudios = item.studios.filter(s => preferences.preferredStudios[s]);
    if (matchedStudios.length > 0) {
      reasons.push(`Favori stüdyo: ${matchedStudios[0]}`);
    }
  }

  // Check MAL score
  if (item.malScore && item.malScore >= preferences.avgRating - 1) {
    reasons.push(`Benzer MAL puanı: ${item.malScore.toFixed(1)}`);
  }

  // Check category
  if (preferences.preferredCategories[item.category]) {
    const categoryData = preferences.preferredCategories[item.category];
    if (categoryData.count >= preferences.totalItems * 0.3) {
      reasons.push(`Favori kategori: ${item.category}`);
    }
  }

  return reasons.length > 0 ? reasons[0] : 'Sana uygun olabilir';
}

/**
 * Generate external recommendations from APIs (placeholder for now)
 * This will be populated with actual API calls in the hook
 * @param {Object} preferences - User preference profile
 * @returns {Promise<Array>} External recommendations
 */
export async function generateExternalRecommendations(preferences) {
  // This is a placeholder - actual implementation will be in the hook
  // where we'll call Jikan and TMDB APIs
  return [];
}

/**
 * Normalize title for better matching (remove special chars, lowercase, trim)
 * @param {string} title - Title to normalize
 * @returns {string} Normalized title
 */
function normalizeTitle(title) {
  return title
    .toLowerCase()
    .replace(/[:\-\s'"!?.,]/g, '') // Remove special chars and spaces
    .trim();
}

/**
 * Main recommendation function
 * @param {Array} mediaItems - User's media collection
 * @param {Array} externalItems - Items from external APIs
 * @param {number} limit - Maximum number of recommendations
 * @returns {Array} Final recommendations
 */
export function getRecommendations(mediaItems, externalItems = [], limit = 6) {
  // Need at least 5 rated items to make good recommendations
  const ratedItems = mediaItems.filter(item => item.rating && item.rating > 0);
  if (ratedItems.length < 5) {
    return [];
  }

  // Analyze preferences
  const preferences = analyzeUserPreferences(mediaItems);

  // Score external items
  const scoredExternalItems = externalItems.map(item => ({
    ...item,
    relevanceScore: calculateRelevanceScore(item, preferences),
    reason: getRecommendationReason(item, preferences),
    source: 'external'
  }));

  // Create comprehensive duplicate check sets
  const userTitles = new Set(mediaItems.map(item => normalizeTitle(item.title)));
  const userOriginalTitles = new Set(
    mediaItems
      .filter(item => item.originalTitle)
      .map(item => normalizeTitle(item.originalTitle))
  );
  const userMalIds = new Set(mediaItems.filter(item => item.malId).map(item => item.malId));
  const userTmdbIds = new Set(mediaItems.filter(item => item.tmdbId).map(item => item.tmdbId));
  
  // Filter out items user already has
  const filteredExternal = scoredExternalItems.filter(item => {
    // Check title
    const titleMatch = userTitles.has(normalizeTitle(item.title));
    
    // Check original title
    const originalTitleMatch = item.originalTitle && 
      (userTitles.has(normalizeTitle(item.originalTitle)) ||
       userOriginalTitles.has(normalizeTitle(item.originalTitle)));
    
    // Check MAL ID
    const malIdMatch = item.malId && userMalIds.has(item.malId);
    
    // Check TMDB ID
    const tmdbIdMatch = item.tmdbId && userTmdbIds.has(item.tmdbId);
    
    // Return false (filter out) if any match found
    return !titleMatch && !originalTitleMatch && !malIdMatch && !tmdbIdMatch;
  });

  // Sort by relevance score
  filteredExternal.sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Return top N (only external recommendations)
  return filteredExternal.slice(0, limit);
}

