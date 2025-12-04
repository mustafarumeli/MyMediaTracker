import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function StudioBarChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <div className="text-4xl mb-2">🏢</div>
        <div>Stüdyo bilgisi bulunamadı</div>
      </div>
    );
  }

  const chartData = data.map(item => ({
    studio: item.studio.length > 20 ? item.studio.substring(0, 20) + '...' : item.studio,
    fullStudio: item.studio,
    count: item.count,
    avgScore: item.avgScore
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis 
          dataKey="studio" 
          angle={-45}
          textAnchor="end"
          height={120}
          tick={{ fill: '#FFB800', fontSize: 11 }}
        />
        <YAxis 
          tick={{ fill: '#FFB800' }}
          label={{ value: 'Anime Sayısı', angle: -90, position: 'insideLeft', fill: '#FFB800' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1a1a1a', 
            border: '1px solid #FFB800',
            borderRadius: '8px'
          }}
          labelStyle={{ color: '#FFB800' }}
          formatter={(value, name, props) => {
            if (name === 'count') {
              return [`${value} anime (ort: ${props.payload.avgScore.toFixed(1)})`, 'İzlenen'];
            }
            return value;
          }}
        />
        <Bar dataKey="count" fill="#FFB800" name="Anime Sayısı" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default StudioBarChart;

