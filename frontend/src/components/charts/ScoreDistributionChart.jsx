import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = {
  '10': '#FFD700',      // Gold
  '9-9.9': '#FFA500',   // Orange
  '8-8.9': '#FF8C00',   // Dark Orange
  '7-7.9': '#FFB800',   // Yellow
  '6-6.9': '#FFC857',   // Light Yellow
  '5-5.9': '#808080',   // Gray
  '<5': '#555555'       // Dark Gray
};

function ScoreDistributionChart({ data }) {
  if (!data) {
    return null;
  }

  const chartData = Object.entries(data).map(([range, count]) => ({
    range,
    count,
    color: COLORS[range]
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis 
          dataKey="range" 
          tick={{ fill: '#FFB800' }}
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
          cursor={{ fill: 'rgba(255, 184, 0, 0.1)' }}
        />
        <Bar dataKey="count" name="Anime Sayısı">
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default ScoreDistributionChart;

