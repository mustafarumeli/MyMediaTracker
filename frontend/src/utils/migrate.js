import { useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';

// Eski schema'dan yeni schema'ya migration
export async function migrateOldData() {
  try {
    console.log('Starting migration...');
    
    const mediaRef = collection(db, 'media-items');
    const snapshot = await getDocs(mediaRef);
    
    let migratedCount = 0;
    const batchPromises = [];

    snapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      
      // Eğer eski 'type' alanı varsa ve yeni 'category' yoksa migrate et
      if (data.type && !data.category) {
        const updates = {
          category: data.type === 'movie' ? 'Film' : 'Oyun',
          imageUrl: data.imageUrl || '',
          imageType: data.imageType || 'none'
        };
        
        // Eski 'type' alanını kaldır
        // Not: Firestore'da field silmek için deleteField() kullanılır
        // Ama burada sadece yeni field ekleyeceğiz, eski field'ı silmeye gerek yok
        
        const docRef = doc(db, 'media-items', docSnapshot.id);
        batchPromises.push(updateDoc(docRef, updates));
        migratedCount++;
      }
    });

    await Promise.all(batchPromises);
    
    console.log(`Migration completed! ${migratedCount} documents migrated.`);
    return { success: true, migratedCount };
  } catch (error) {
    console.error('Migration error:', error);
    return { success: false, error: error.message };
  }
}

// Manuel migration butonu için Dashboard'da kullanılabilir
export function MigrationButton() {
  const [migrating, setMigrating] = useState(false);
  const [result, setResult] = useState(null);

  const handleMigrate = async () => {
    if (!confirm('Mevcut verileri yeni schema\'ya dönüştürmek istiyor musunuz?')) {
      return;
    }

    setMigrating(true);
    const result = await migrateOldData();
    setResult(result);
    setMigrating(false);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-white font-bold mb-2">Veri Migration</h3>
      <p className="text-gray-400 text-sm mb-4">
        Eski verileri yeni schema'ya dönüştürün (type → category)
      </p>
      <button
        onClick={handleMigrate}
        disabled={migrating}
        className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {migrating ? 'Dönüştürülüyor...' : 'Verileri Dönüştür'}
      </button>
      {result && (
        <div className={`mt-4 p-3 rounded ${result.success ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}`}>
          {result.success
            ? `Başarılı! ${result.migratedCount} kayıt dönüştürüldü.`
            : `Hata: ${result.error}`
          }
        </div>
      )}
    </div>
  );
}

