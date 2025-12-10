import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function GenreBarChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <div className="text-4xl mb-2">📊</div>
        <div>Tür bilgisi bulunamadı</div>
      </div>
    );
  }

  // Top 10 genres by average score
  const topGenres = data
    .filter(item => item.avgScore > 0)
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 10)
    .map(item => ({
      genre: item.genre.length > 15 ? item.genre.substring(0, 15) + '...' : item.genre,
      fullGenre: item.genre,
      avgScore: item.avgScore,
      count: item.count
    }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={topGenres} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis 
          type="number" 
          domain={[0, 10]}
          tick={{ fill: '#FFB800' }}
        />
        <YAxis 
          type="category"
          dataKey="genre" 
          tick={{ fill: '#FFB800', fontSize: 12 }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1a1a1a', 
            border: '1px solid #FFB800',
            borderRadius: '8px'
          }}
          labelStyle={{ color: '#FFB800' }}
          formatter={(value, name, props) => {
            if (name === 'avgScore') {
              return [`${value.toFixed(2)} (${props.payload.count} anime)`, 'Ortalama Puan'];
            }
            return value;
          }}
        />
        <Bar dataKey="avgScore" fill="#FFB800" name="Ortalama Puan" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default GenreBarChart;



