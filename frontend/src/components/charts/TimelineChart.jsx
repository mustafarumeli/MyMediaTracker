import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function TimelineChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <div className="text-4xl mb-2">📈</div>
        <div>Zaman verisi bulunamadı</div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis 
          dataKey="month" 
          tick={{ fill: '#FFB800', fontSize: 11 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis 
          tick={{ fill: '#FFB800' }}
          label={{ value: 'Eklenen Anime', angle: -90, position: 'insideLeft', fill: '#FFB800' }}
          allowDecimals={false}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1a1a1a', 
            border: '1px solid #FFB800',
            borderRadius: '8px'
          }}
          labelStyle={{ color: '#FFB800' }}
        />
        <Line 
          type="monotone" 
          dataKey="count" 
          stroke="#FFB800" 
          strokeWidth={3}
          dot={{ fill: '#FFB800', r: 5 }}
          activeDot={{ r: 8 }}
          name="Eklenen Anime"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default TimelineChart;



