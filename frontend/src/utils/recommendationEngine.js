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

  // Get recommendations from own database
  const ownRecs = generateOwnRecommendations(mediaItems, preferences);

  // Score external items
  const scoredExternalItems = externalItems.map(item => ({
    ...item,
    relevanceScore: calculateRelevanceScore(item, preferences),
    reason: getRecommendationReason(item, preferences),
    source: 'external'
  }));

  // Filter out items user already has
  const userTitles = new Set(mediaItems.map(item => item.title.toLowerCase()));
  const userMalIds = new Set(mediaItems.filter(item => item.malId).map(item => item.malId));
  
  const filteredExternal = scoredExternalItems.filter(item => {
    const titleMatch = userTitles.has(item.title.toLowerCase());
    const malIdMatch = item.malId && userMalIds.has(item.malId);
    return !titleMatch && !malIdMatch;
  });

  // Merge and sort all recommendations
  const allRecs = [...ownRecs, ...filteredExternal];
  
  // Sort by relevance score
  allRecs.sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Return top N, ensuring diversity (mix of own and external)
  const finalRecs = [];
  const ownRecsFiltered = allRecs.filter(r => r.source === 'own');
  const externalRecsFiltered = allRecs.filter(r => r.source === 'external');

  // Alternate between own and external recommendations
  let ownIndex = 0;
  let externalIndex = 0;
  
  while (finalRecs.length < limit && (ownIndex < ownRecsFiltered.length || externalIndex < externalRecsFiltered.length)) {
    // Add external first (more interesting for users)
    if (externalIndex < externalRecsFiltered.length) {
      finalRecs.push(externalRecsFiltered[externalIndex]);
      externalIndex++;
    }
    
    if (finalRecs.length >= limit) break;
    
    // Then add own
    if (ownIndex < ownRecsFiltered.length) {
      finalRecs.push(ownRecsFiltered[ownIndex]);
      ownIndex++;
    }
  }

  return finalRecs.slice(0, limit);
}

