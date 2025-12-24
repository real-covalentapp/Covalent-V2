
import { FormResponse, StorageResult } from '../types';

/**
 * CLOUDSUBMIT PRO - PERSISTENCE SERVICE
 * Uses npoint.io for true cross-device synchronization.
 * Updated with enhanced headers and CORS settings for mobile stability.
 */

// Unique Public Bin ID - Shared across all instances
const BIN_ID = '062d6b38c35064560d2b'; 
const CLOUD_URL = `https://api.npoint.io/${BIN_ID}`;

export const storageService = {
  /**
   * Saves a response to the global cloud bin.
   * Handles the 'Fetch Existing -> Append -> Push New' cycle.
   */
  saveResponse: async (response: Omit<FormResponse, 'id' | 'timestamp' | 'device'>): Promise<StorageResult> => {
    try {
      // 1. Prepare the new entry immediately to get accurate timestamp/device
      const newEntry: FormResponse = {
        ...response,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        device: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
                ? 'Mobile' : 'Desktop'
      };

      // 2. Fetch current cloud data with cache-busting
      let responses: FormResponse[] = [];
      try {
        const getRes = await fetch(`${CLOUD_URL}?nocache=${Date.now()}`, {
          method: 'GET',
          mode: 'cors',
          headers: { 'Accept': 'application/json' }
        });
        
        if (getRes.ok) {
          const data = await getRes.json();
          responses = Array.isArray(data) ? data : [];
        }
      } catch (e) {
        console.warn("Cloud access restricted or new bin needed:", e);
        // We continue even if fetch fails to attempt an 'upsert'
      }

      // 3. Add new entry to the top
      const updatedData = [newEntry, ...responses].slice(0, 100); // Keep last 100 for performance

      // 4. Push back to Cloud with explicit CORS and headers
      const putRes = await fetch(CLOUD_URL, {
        method: 'POST',
        mode: 'cors',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });

      if (!putRes.ok) {
        throw new Error(`Cloud returned status ${putRes.status}`);
      }
      
      return { success: true, message: 'Response synced to cloud successfully!' };
    } catch (error) {
      console.error("Cloud Connectivity Error:", error);
      return { 
        success: false, 
        message: 'Cloud sync failed. This is usually due to strict mobile network settings or temporary API downtime. Please try again.' 
      };
    }
  },

  /**
   * Retrieves all responses from the shared cloud.
   */
  getAllResponses: async (): Promise<FormResponse[]> => {
    try {
      const res = await fetch(`${CLOUD_URL}?nocache=${Date.now()}`, {
        method: 'GET',
        mode: 'cors',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Cloud Pull Error:", error);
      return [];
    }
  },

  /**
   * Resets the cloud bin.
   */
  clearResponses: async (): Promise<void> => {
    try {
      await fetch(CLOUD_URL, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([])
      });
    } catch (error) {
      console.error("Cloud Reset Error:", error);
    }
  }
};
