import { collection, query, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Migration script to add rewatchCount field to existing media items
 * This should be run once after deploying the rewatch feature
 */
export async function migrateRewatchCount() {
  try {
    console.log('Starting rewatch count migration...');
    
    // Query all media items
    const mediaQuery = query(collection(db, 'media-items'));
    const snapshot = await getDocs(mediaQuery);
    
    let migratedCount = 0;
    let skippedCount = 0;
    
    // Update each media item
    const updatePromises = snapshot.docs.map(async (docSnap) => {
      const data = docSnap.data();
      
      // Only update if rewatchCount field doesn't exist
      if (data.rewatchCount === undefined) {
        const mediaRef = doc(db, 'media-items', docSnap.id);
        await updateDoc(mediaRef, {
          rewatchCount: 0
        });
        migratedCount++;
        return true;
      } else {
        skippedCount++;
        return false;
      }
    });
    
    await Promise.all(updatePromises);
    
    console.log(`Migration complete! Migrated: ${migratedCount}, Skipped: ${skippedCount}`);
    
    return {
      success: true,
      migrated: migratedCount,
      skipped: skippedCount,
      total: snapshot.docs.length
    };
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
}

/**
 * Check if migration is needed
 * @returns {Promise<boolean>} True if migration is needed
 */
export async function needsMigration() {
  try {
    const mediaQuery = query(collection(db, 'media-items'));
    const snapshot = await getDocs(mediaQuery);
    
    // Check if any item is missing rewatchCount
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      if (data.rewatchCount === undefined) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error checking migration status:', error);
    return false;
  }
}

/**
 * Auto-run migration on app load (silent)
 * This will be called from App.jsx or Dashboard.jsx
 */
export async function autoMigrateRewatchCount() {
  const MIGRATION_KEY = 'rewatch_migration_completed';
  
  // Check if migration was already completed
  const migrationCompleted = localStorage.getItem(MIGRATION_KEY);
  if (migrationCompleted === 'true') {
    return {
      skipped: true,
      reason: 'Already migrated'
    };
  }
  
  try {
    // Check if migration is needed
    const needed = await needsMigration();
    
    if (!needed) {
      // Mark as completed
      localStorage.setItem(MIGRATION_KEY, 'true');
      return {
        skipped: true,
        reason: 'No migration needed'
      };
    }
    
    // Run migration
    const result = await migrateRewatchCount();
    
    // Mark as completed
    localStorage.setItem(MIGRATION_KEY, 'true');
    
    return result;
  } catch (error) {
    console.error('Auto-migration failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

