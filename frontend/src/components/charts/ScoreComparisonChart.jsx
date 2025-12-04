import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function ScoreComparisonChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <div className="text-4xl mb-2">📊</div>
        <div>MAL puanı olan anime bulunamadı</div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis 
          dataKey="title" 
          angle={-45}
          textAnchor="end"
          height={100}
          tick={{ fill: '#FFB800', fontSize: 12 }}
        />
        <YAxis 
          domain={[0, 10]}
          tick={{ fill: '#FFB800' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1a1a1a', 
            border: '1px solid #FFB800',
            borderRadius: '8px'
          }}
          labelStyle={{ color: '#FFB800' }}
          formatter={(value) => value.toFixed(1)}
        />
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="circle"
        />
        <Bar dataKey="myScore" fill="#FFB800" name="Benim Puanım" />
        <Bar dataKey="malScore" fill="#4A90E2" name="MAL Puanı" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default ScoreComparisonChart;

