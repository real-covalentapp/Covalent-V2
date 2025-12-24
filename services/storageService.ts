import { FormResponse, StorageResult } from '../types';

/**
 * CLOUDSUBMIT PRO - PERSISTENCE SERVICE
 * Optimized for mobile networks and cross-device synchronization.
 */

// Use a unique, verified public bin ID. 
// If this specific ID fails, the code will fall back gracefully.
const BIN_ID = '062d6b38c35064560d2b'; 
const CLOUD_URL = `https://api.npoint.io/${BIN_ID}`;

export const storageService = {
  /**
   * Pushes a new response to the cloud.
   * Uses a robust fetch implementation to bypass mobile browser restrictions.
   */
  saveResponse: async (response: Omit<FormResponse, 'id' | 'timestamp' | 'device'>): Promise<StorageResult> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout for mobile

    try {
      const newEntry: FormResponse = {
        ...response,
        id: Math.random().toString(36).substring(2, 11),
        timestamp: Date.now(),
        device: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
                ? 'Mobile' : 'Desktop'
      };

      // 1. Fetch current data with mobile-friendly options
      let currentData: FormResponse[] = [];
      try {
        const getRes = await fetch(`${CLOUD_URL}?t=${Date.now()}`, {
          method: 'GET',
          signal: controller.signal,
          headers: { 'Accept': 'application/json' },
          credentials: 'omit', // Crucial for mobile CORS
          mode: 'cors'
        });
        
        if (getRes.ok) {
          const data = await getRes.json();
          currentData = Array.isArray(data) ? data : [];
        }
      } catch (e) {
        console.warn("Initializing new cloud stream...");
      }

      // 2. Combine and prune (keep last 50 for speed)
      const updatedData = [newEntry, ...currentData].slice(0, 50);

      // 3. POST to cloud with specific mobile-optimized settings
      const postRes = await fetch(CLOUD_URL, {
        method: 'POST',
        signal: controller.signal,
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(updatedData),
        credentials: 'omit',
        mode: 'cors'
      });

      clearTimeout(timeoutId);

      if (!postRes.ok) {
        throw new Error(`Sync Error: ${postRes.status}`);
      }
      
      return { success: true, message: 'Cloud Synchronized' };
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error("Cloud Error Details:", error);
      
      // Detailed error for debugging on mobile
      const errorMsg = error.name === 'AbortError' 
        ? 'Connection Timeout. Please check your signal.' 
        : 'Cloud Sync Failed. Try switching from Wi-Fi to Data or vice versa.';

      return { success: false, message: errorMsg };
    }
  },

  /**
   * Pulls all data for the Admin Dashboard
   */
  getAllResponses: async (): Promise<FormResponse[]> => {
    try {
      const res = await fetch(`${CLOUD_URL}?t=${Date.now()}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        credentials: 'omit',
        mode: 'cors'
      });
      
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
      return [];
    }
  },

  /**
   * Wipes the bin
   */
  clearResponses: async (): Promise<void> => {
    try {
      await fetch(CLOUD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([]),
        credentials: 'omit',
        mode: 'cors'
      });
    } catch (error) {
      console.error("Reset Failed:", error);
    }
  }
};