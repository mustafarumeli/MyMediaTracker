function RatingBadge({ rating }) {
  if (rating >= 9) {
    return (
      <div className="absolute top-2 left-2 bg-gold text-black px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-glow">
        <span>⭐</span>
        <span>Harika!</span>
      </div>
    );
  }
  
  if (rating >= 8) {
    return (
      <div className="absolute top-2 left-2 bg-gold/90 text-black px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
        <span>👍</span>
        <span>Mükemmel</span>
      </div>
    );
  }
  
  if (rating >= 7) {
    return (
      <div className="absolute top-2 left-2 bg-gold/70 text-black px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
        <span>💫</span>
        <span>İyi</span>
      </div>
    );
  }
  
  return null;
}

export default RatingBadge;

