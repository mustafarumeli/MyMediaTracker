import { useState } from 'react';
import { storage } from '../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../contexts/AuthContext';

function ImageUpload({ value, onChange, onUploadStart, onUploadComplete }) {
  const [uploadMethod, setUploadMethod] = useState('url'); // 'url' or 'file'
  const [imageUrl, setImageUrl] = useState(value || '');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState(value || null);
  const { currentUser } = useAuth();

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    setPreview(url);
    onChange({ url, type: 'url' });
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Dosya boyutu 5MB\'dan küçük olmalıdır');
      return;
    }

    // Dosya tipi kontrolü
    if (!file.type.startsWith('image/')) {
      alert('Sadece resim dosyaları yükleyebilirsiniz');
      return;
    }

    // Preview göster
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload başlat
    setUploading(true);
    setUploadProgress(0);
    if (onUploadStart) onUploadStart();

    try {
      // Benzersiz dosya adı
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `media-posters/${currentUser.uid}/${fileName}`);

      // Upload task
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          alert('Resim yüklenirken hata oluştu');
          setUploading(false);
        },
        async () => {
          // Upload başarılı
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImageUrl(downloadURL);
          setUploading(false);
          onChange({ url: downloadURL, type: 'upload' });
          if (onUploadComplete) onUploadComplete(downloadURL);
        }
      );
    } catch (error) {
      console.error('Upload error:', error);
      alert('Resim yüklenirken hata oluştu');
      setUploading(false);
    }
  };

  const clearImage = () => {
    setImageUrl('');
    setPreview(null);
    onChange({ url: '', type: 'none' });
  };

  return (
    <div className="space-y-4">
      {/* Method tabs */}
      <div className="flex gap-2 border-b border-gold/30">
        <button
          type="button"
          onClick={() => setUploadMethod('url')}
          className={`px-4 py-2 transition-all duration-300 ${
            uploadMethod === 'url'
              ? 'text-gold border-b-2 border-gold'
              : 'text-gray-400 hover:text-gold'
          }`}
        >
          🔗 URL
        </button>
        {/* Dosya upload geçici devre dışı - Firebase Storage kurulana kadar */}
        {/* <button
          type="button"
          onClick={() => setUploadMethod('file')}
          className={`px-4 py-2 transition-colors ${
            uploadMethod === 'file'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          📁 Dosya (Yakında)
        </button> */}
      </div>

      {/* URL input */}
      {uploadMethod === 'url' && (
        <div>
          <input
            type="url"
            value={imageUrl}
            onChange={handleUrlChange}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2 bg-dark-850 border border-gold/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:shadow-glow-sm transition-all duration-300"
          />
        </div>
      )}

      {/* File upload */}
      {uploadMethod === 'file' && (
        <div>
          <label className="block">
            <div className="flex items-center justify-center w-full px-4 py-6 bg-dark-850 border-2 border-dashed border-gold/30 rounded-lg cursor-pointer hover:bg-dark-900 hover:border-gold transition-all duration-300">
              {uploading ? (
                <div className="text-center">
                  <div className="text-gold mb-2">Yükleniyor...</div>
                  <div className="w-full bg-dark-900 rounded-full h-2">
                    <div
                      className="bg-gold h-2 rounded-full transition-all duration-300 shadow-glow-sm"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-400 mt-2">
                    {uploadProgress.toFixed(0)}%
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-4xl mb-2">📸</div>
                  <div className="text-white">Resim seçmek için tıklayın</div>
                  <div className="text-sm text-gray-400 mt-1">Maksimum 5MB</div>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      )}

      {/* Preview */}
      {preview && !uploading && (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 bg-dark-950 hover:bg-red-600 border border-red-500 text-red-400 hover:text-white rounded-full w-8 h-8 flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;

