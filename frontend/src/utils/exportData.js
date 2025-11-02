import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Export all media items and their episodes to JSON (without image URLs)
 */
export async function exportMediaData(currentUser) {
  if (!currentUser) {
    throw new Error('User not authenticated');
  }

  try {
    // Fetch all media items
    const mediaQuery = query(
      collection(db, 'media-items'),
      orderBy('createdAt', 'desc')
    );
    const mediaSnapshot = await getDocs(mediaQuery);
    
    const exportData = [];

    // For each media item, fetch its episodes
    for (const mediaDoc of mediaSnapshot.docs) {
      const mediaData = mediaDoc.data();
      
      // Remove image-related fields
      const { imageUrl, imageType, ...cleanMediaData } = mediaData;
      
      // Fetch episodes for this media
      const episodesRef = collection(db, `media-items/${mediaDoc.id}/episodes`);
      const episodesQuery = query(episodesRef, orderBy('seasonNumber', 'asc'), orderBy('episodeNumber', 'asc'));
      const episodesSnapshot = await getDocs(episodesQuery);
      
      const episodes = episodesSnapshot.docs.map(epDoc => ({
        id: epDoc.id,
        ...epDoc.data()
      }));

      // Add to export data
      exportData.push({
        id: mediaDoc.id,
        ...cleanMediaData,
        episodes: episodes
      });
    }

    // Create filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `media-backup-${date}.json`;

    // Convert to JSON and trigger download
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create temporary link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Cleanup
    URL.revokeObjectURL(url);
    
    return {
      success: true,
      count: exportData.length,
      filename
    };
  } catch (error) {
    console.error('Export error:', error);
    throw error;
  }
}

