
import { FormResponse, StorageResult } from '../types';

/**
 * CLOUDSUBMIT PRO - PERSISTENCE SERVICE
 * To achieve true cross-device sync, we use a public JSON storage API (npoint.io).
 * This acts as a central cloud database shared by all instances of the app.
 */

// A unique public bin ID for this specific application instance
const BIN_ID = '062d6b38c35064560d2b'; 
const CLOUD_URL = `https://api.npoint.io/${BIN_ID}`;

export const storageService = {
  /**
   * Fetches the current state from the cloud, adds the new response, 
   * and pushes the updated array back.
   */
  saveResponse: async (response: Omit<FormResponse, 'id' | 'timestamp' | 'device'>): Promise<StorageResult> => {
    try {
      // 1. Fetch current cloud data
      let responses: FormResponse[] = [];
      try {
        const getRes = await fetch(CLOUD_URL);
        if (getRes.ok) {
          const data = await getRes.json();
          // If the bin is empty or not an array, default to empty list
          responses = Array.isArray(data) ? data : [];
        }
      } catch (e) {
        console.warn("Initializing new cloud bin...");
      }

      // 2. Prepare new entry
      const newResponse: FormResponse = {
        ...response,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        device: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
                ? 'Mobile' : 'Desktop'
      };

      // 3. Update collection (newest first)
      responses.unshift(newResponse);

      // 4. Push back to Cloud
      const putRes = await fetch(CLOUD_URL, {
        method: 'POST', // npoint uses POST to update bin content
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(responses)
      });

      if (!putRes.ok) throw new Error("Cloud update failed");
      
      return { success: true, message: 'Response synced to cloud successfully!' };
    } catch (error) {
      console.error("Cloud Error:", error);
      return { success: false, message: 'Cloud sync failed. Connection issue.' };
    }
  },

  /**
   * Retrieves all responses from the shared cloud bin.
   */
  getAllResponses: async (): Promise<FormResponse[]> => {
    try {
      const res = await fetch(CLOUD_URL);
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Fetch Error:", error);
      return [];
    }
  },

  /**
   * Resets the cloud bin to an empty array.
   */
  clearResponses: async (): Promise<void> => {
    try {
      await fetch(CLOUD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([])
      });
    } catch (error) {
      console.error("Clear Error:", error);
    }
  }
};
