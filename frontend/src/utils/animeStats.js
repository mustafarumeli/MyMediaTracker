/**
 * Calculate comprehensive statistics for anime collection
 * @param {Array} animeList - Array of anime media items
 * @param {Object} episodesMap - Map of mediaId to episodes array
 * @returns {Object} Calculated statistics
 */
export function calculateAnimeStats(animeList, episodesMap = {}) {
  if (!animeList || animeList.length === 0) {
    return null;
  }

  // Filter only anime
  const animes = animeList.filter(item => item.category === 'Anime');
  
  if (animes.length === 0) {
    return null;
  }

  // Basic stats
  const totalAnime = animes.length;
  const animesWithMalScore = animes.filter(a => a.malScore);
  
  const avgMyScore = animes.reduce((sum, a) => sum + (a.rating || 0), 0) / totalAnime;
  const avgMalScore = animesWithMalScore.length > 0
    ? animesWithMalScore.reduce((sum, a) => sum + a.malScore, 0) / animesWithMalScore.length
    : 0;

  // Total episodes watched
  let totalEpisodes = 0;
  animes.forEach(anime => {
    const episodes = episodesMap[anime.id] || [];
    totalEpisodes += episodes.length;
  });

  // Score distribution
  const scoreDistribution = {
    '10': 0,
    '9-9.9': 0,
    '8-8.9': 0,
    '7-7.9': 0,
    '6-6.9': 0,
    '5-5.9': 0,
    '<5': 0
  };

  animes.forEach(anime => {
    const score = anime.rating || 0;
    if (score === 10) scoreDistribution['10']++;
    else if (score >= 9) scoreDistribution['9-9.9']++;
    else if (score >= 8) scoreDistribution['8-8.9']++;
    else if (score >= 7) scoreDistribution['7-7.9']++;
    else if (score >= 6) scoreDistribution['6-6.9']++;
    else if (score >= 5) scoreDistribution['5-5.9']++;
    else if (score > 0) scoreDistribution['<5']++;
  });

  // Genre statistics
  const genreMap = {};
  animes.forEach(anime => {
    if (anime.genres && Array.isArray(anime.genres)) {
      anime.genres.forEach(genre => {
        if (!genreMap[genre]) {
          genreMap[genre] = { count: 0, totalScore: 0, scores: [] };
        }
        genreMap[genre].count++;
        if (anime.rating) {
          genreMap[genre].totalScore += anime.rating;
          genreMap[genre].scores.push(anime.rating);
        }
      });
    }
  });

  const genreStats = Object.entries(genreMap).map(([genre, data]) => ({
    genre,
    count: data.count,
    avgScore: data.scores.length > 0 ? data.totalScore / data.scores.length : 0
  })).sort((a, b) => b.count - a.count);

  // Studio statistics
  const studioMap = {};
  animes.forEach(anime => {
    if (anime.studios && Array.isArray(anime.studios)) {
      anime.studios.forEach(studio => {
        if (!studioMap[studio]) {
          studioMap[studio] = { count: 0, totalScore: 0, scores: [] };
        }
        studioMap[studio].count++;
        if (anime.rating) {
          studioMap[studio].totalScore += anime.rating;
          studioMap[studio].scores.push(anime.rating);
        }
      });
    }
  });

  const studioStats = Object.entries(studioMap).map(([studio, data]) => ({
    studio,
    count: data.count,
    avgScore: data.scores.length > 0 ? data.totalScore / data.scores.length : 0
  })).sort((a, b) => b.count - a.count);

  // Monthly trend (last 12 months)
  const monthlyTrend = [];
  const now = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'short' });
    
    const count = animes.filter(anime => {
      if (!anime.createdAt?.seconds) return false;
      const animeDate = new Date(anime.createdAt.seconds * 1000);
      return animeDate.getFullYear() === date.getFullYear() && 
             animeDate.getMonth() === date.getMonth();
    }).length;
    
    monthlyTrend.push({ month: monthName, monthKey, count });
  }

  // Top anime by episode count
  const animeWithEpisodes = animes.map(anime => ({
    ...anime,
    episodeCount: (episodesMap[anime.id] || []).length
  })).filter(a => a.episodeCount > 0);
  
  const topEpisodeCounts = animeWithEpisodes
    .sort((a, b) => b.episodeCount - a.episodeCount)
    .slice(0, 5)
    .map(a => ({
      title: a.title,
      episodes: a.episodeCount
    }));

  // Score comparison (for chart)
  const scoreComparison = animes
    .filter(a => a.malScore) // Only show animes with MAL score
    .map(a => ({
      title: a.title.length > 20 ? a.title.substring(0, 20) + '...' : a.title,
      fullTitle: a.title,
      myScore: a.rating || 0,
      malScore: a.malScore || 0
    }))
    .sort((a, b) => b.myScore - a.myScore)
    .slice(0, 15); // Top 15 for readability

  return {
    totalAnime,
    avgMyScore: avgMyScore.toFixed(2),
    avgMalScore: avgMalScore.toFixed(2),
    totalEpisodes,
    scoreDistribution,
    genreStats,
    studioStats: studioStats.slice(0, 10), // Top 10 studios
    monthlyTrend,
    topEpisodeCounts,
    scoreComparison,
    animesWithMalData: animesWithMalScore.length
  };
}

