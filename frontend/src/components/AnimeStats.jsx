import { useNavigate } from 'react-router-dom';
import { useAnimeStats } from '../hooks/useAnimeStats';
import StatCard from './StatCard';
import ScoreComparisonChart from './charts/ScoreComparisonChart';
import ScoreDistributionChart from './charts/ScoreDistributionChart';
import GenrePieChart from './charts/GenrePieChart';
import GenreBarChart from './charts/GenreBarChart';
import StudioBarChart from './charts/StudioBarChart';
import TimelineChart from './charts/TimelineChart';

function AnimeStats() {
  const navigate = useNavigate();
  const { stats, loading, error } = useAnimeStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📊</div>
          <div className="text-gold text-xl">İstatistikler hesaplanıyor...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <div className="text-red-400 text-xl mb-4">Bir hata oluştu</div>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary py-3 px-6"
          >
            Dashboard'a Dön
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-dark-950 text-white">
        {/* Header */}
        <nav className="bg-dark-950 shadow-glow border-b-2 border-gold">
          <div className="container mx-auto px-4 py-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors duration-200"
            >
              <span className="text-2xl">←</span>
              <span className="font-semibold">Dashboard'a Dön</span>
            </button>
          </div>
        </nav>

        {/* Empty State */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-8xl mb-6">🎌</div>
            <h2 className="text-3xl font-bold text-gold mb-4">Henüz Anime Eklenmemiş</h2>
            <p className="text-gray-400 mb-8">
              İstatistikleri görmek için önce anime ekleyin ve Jikan'dan MAL bilgilerini çekin.
            </p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary py-3 px-8"
            >
              Dashboard'a Git
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      {/* Header */}
      <nav className="bg-dark-950 shadow-glow border-b-2 border-gold sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors duration-200"
            >
              <span className="text-2xl">←</span>
              <span className="font-semibold">Dashboard'a Dön</span>
            </button>
            <h1 className="text-2xl font-bold text-gold flex items-center gap-2">
              <span>📊</span>
              <span>Anime İstatistikleri</span>
            </h1>
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon="🎌"
            title="Toplam Anime"
            value={stats.totalAnime}
            subtitle="İzlenen"
          />
          <StatCard
            icon="⭐"
            title="Ortalama Puanım"
            value={stats.avgMyScore}
            subtitle="/ 10"
          />
          <StatCard
            icon="📊"
            title="Ortalama MAL Puanı"
            value={stats.avgMalScore}
            subtitle={`${stats.animesWithMalData} anime`}
          />
        </div>

        {/* Score Comparison */}
        {stats.scoreComparison && stats.scoreComparison.length > 0 && (
          <div className="bg-dark-900 border-2 border-gold/30 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gold mb-4 flex items-center gap-2">
              <span>📈</span>
              <span>Puan Karşılaştırması (Top 15)</span>
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Benim puanlarım ile MAL puanlarının karşılaştırması
            </p>
            <ScoreComparisonChart data={stats.scoreComparison} />
          </div>
        )}

        {/* Score Distribution */}
        <div className="bg-dark-900 border-2 border-gold/30 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gold mb-4 flex items-center gap-2">
            <span>📊</span>
            <span>Puan Dağılımı</span>
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Her puan aralığında kaç anime var
          </p>
          <ScoreDistributionChart data={stats.scoreDistribution} />
        </div>

        {/* Genre Analysis */}
        {stats.genreStats && stats.genreStats.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Genre Pie Chart */}
            <div className="bg-dark-900 border-2 border-gold/30 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gold mb-4 flex items-center gap-2">
                <span>🏷️</span>
                <span>En Çok İzlenen Türler</span>
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                Top 8 tür (anime sayısına göre)
              </p>
              <GenrePieChart data={stats.genreStats} />
            </div>

            {/* Genre Bar Chart */}
            <div className="bg-dark-900 border-2 border-gold/30 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gold mb-4 flex items-center gap-2">
                <span>⭐</span>
                <span>Tür Başına Ortalama Puan</span>
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                Hangi türlere daha yüksek puan veriyorum
              </p>
              <GenreBarChart data={stats.genreStats} />
            </div>
          </div>
        )}

        {/* Studio Statistics */}
        {stats.studioStats && stats.studioStats.length > 0 && (
          <div className="bg-dark-900 border-2 border-gold/30 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gold mb-4 flex items-center gap-2">
              <span>🏢</span>
              <span>En Çok İzlenen Stüdyolar</span>
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Hangi stüdyoların animelerini daha çok izliyorum (Top 10)
            </p>
            <StudioBarChart data={stats.studioStats} />
          </div>
        )}

        {/* Timeline */}
        <div className="bg-dark-900 border-2 border-gold/30 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gold mb-4 flex items-center gap-2">
            <span>📅</span>
            <span>Zaman Analizi (Son 12 Ay)</span>
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Hangi aylarda daha çok anime ekliyorum
          </p>
          <TimelineChart data={stats.monthlyTrend} />
        </div>
      </div>
    </div>
  );
}

export default AnimeStats;

