import MediaCard from './MediaCard';

function MediaList({ media, onDelete, onEdit, loading }) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="text-gray-400 mt-4">Yükleniyor...</p>
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-800 rounded-lg">
        <p className="text-gray-400 text-lg">Henüz bir şey eklemediniz.</p>
        <p className="text-gray-500 mt-2">Yukarıdaki formu kullanarak film veya oyun ekleyin!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {media.map((item) => (
        <MediaCard
          key={item.id}
          media={item}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

export default MediaList;

