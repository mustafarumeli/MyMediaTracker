function ConfirmDeleteModal({ isOpen, onClose, onConfirm, media, loading = false }) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-900 border-2 border-red-500 rounded-lg shadow-glow-lg max-w-md w-full animate-fadeIn">
        {/* Header */}
        <div className="p-6 border-b border-red-500/30">
          <div className="flex items-center gap-3">
            <span className="text-4xl">⚠️</span>
            <h2 className="text-2xl font-bold text-red-400">Silme Onayı</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-white mb-4">
            Bu medyayı silmek istediğinizden emin misiniz?
          </p>
          
          {media && (
            <div className="bg-dark-950 border border-gold/20 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                {media.imageUrl ? (
                  <img 
                    src={media.imageUrl} 
                    alt={media.title}
                    className="w-16 h-20 object-cover rounded border border-gold/30"
                  />
                ) : (
                  <div className="w-16 h-20 bg-dark-850 rounded border border-gold/30 flex items-center justify-center text-2xl">
                    📁
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-gold font-semibold mb-1 truncate">{media.title}</h3>
                  <p className="text-gray-400 text-sm mb-1">{media.category}</p>
                  <p className="text-gray-500 text-xs">
                    Puan: {media.rating}/10
                  </p>
                </div>
              </div>
            </div>
          )}

          <p className="text-red-400 text-sm">
            ⚠️ Bu işlem geri alınamaz. Tüm bölüm bilgileri de silinecektir.
          </p>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-red-500/30 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-dark-950 border border-gold/30 text-white rounded-lg hover:border-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            İptal
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Siliniyor...</span>
              </>
            ) : (
              <>
                <span>🗑️</span>
                <span>Sil</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;

