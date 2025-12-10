import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#FFB800', '#FFA500', '#FF8C00', '#FFD700', '#FFC857', '#E0A800', '#D4AF37', '#F0C800'];

function GenrePieChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <div className="text-4xl mb-2">🏷️</div>
        <div>Tür bilgisi bulunamadı</div>
      </div>
    );
  }

  // Top 8 genres for readability
  const topGenres = data.slice(0, 8).map(item => ({
    name: item.genre,
    value: item.count
  }));

  const renderLabel = (entry) => {
    return `${entry.name} (${entry.value})`;
  };

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={topGenres}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderLabel}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {topGenres.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1a1a1a', 
            border: '1px solid #FFB800',
            borderRadius: '8px'
          }}
        />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          formatter={(value, entry) => `${value} (${entry.payload.value})`}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default GenrePieChart;



