function StatCard({ icon, title, value, subtitle, trend, bgColor = 'bg-dark-900' }) {
  return (
    <div className={`${bgColor} border-2 border-gold/30 rounded-lg p-6 hover:border-gold transition-all duration-300 hover:shadow-glow-sm`}>
      <div className="flex items-start justify-between mb-3">
        <div className="text-4xl">{icon}</div>
        {trend && (
          <span className="text-xs px-2 py-1 bg-gold/20 text-gold rounded-full">
            {trend}
          </span>
        )}
      </div>
      
      <div className="text-sm text-gray-400 mb-1">{title}</div>
      
      <div className="text-3xl font-bold text-gold mb-1">
        {value}
      </div>
      
      {subtitle && (
        <div className="text-xs text-gray-500">
          {subtitle}
        </div>
      )}
    </div>
  );
}

export default StatCard;



