import { FormResponse, StorageResult } from '../types';

/**
 * CLOUDSUBMIT PRO - PERSISTENCE SERVICE
 * Optimized for high-reliability mobile synchronization.
 */

// Fresh Bin ID to ensure clean state and avoid rate limits
const BIN_ID = 'e9c8a9c298084a4f89d1'; 
const CLOUD_URL = `https://api.npoint.io/${BIN_ID}`;

const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

const robustFetch = async (url: string, options: RequestInit, retries = 3): Promise<Response> => {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'omit',
      mode: 'cors',
      keepalive: true // Essential for mobile reliability
    });
    
    if (!response.ok && retries > 0) {
      await wait(1000 * (4 - retries)); // Exponential backoff
      return robustFetch(url, options, retries - 1);
    }
    return response;
  } catch (err) {
    if (retries > 0) {
      await wait(1000 * (4 - retries));
      return robustFetch(url, options, retries - 1);
    }
    throw err;
  }
};

export const storageService = {
  /**
   * Pushes a new response to the cloud with retry logic.
   */
  saveResponse: async (response: Omit<FormResponse, 'id' | 'timestamp' | 'device'>): Promise<StorageResult> => {
    try {
      const newEntry: FormResponse = {
        ...response,
        id: Math.random().toString(36).substring(2, 11),
        timestamp: Date.now(),
        device: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
                ? 'Mobile' : 'Desktop'
      };

      // 1. Fetch existing data
      let currentData: FormResponse[] = [];
      const getRes = await robustFetch(`${CLOUD_URL}?nocache=${Date.now()}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      if (getRes.ok) {
        const data = await getRes.json();
        currentData = Array.isArray(data) ? data : [];
      }

      // 2. Append and keep only recent items for performance
      const updatedData = [newEntry, ...currentData].slice(0, 100);

      // 3. Post back to cloud
      const postRes = await robustFetch(CLOUD_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });

      if (!postRes.ok) {
        throw new Error(`Cloud Sync failed with status: ${postRes.status}`);
      }
      
      return { success: true, message: 'Cloud Synchronized' };
    } catch (error: any) {
      console.error("Cloud Sync Error:", error);
      return { 
        success: false, 
        message: 'Sync error. Your mobile network may be blocking the cloud provider. Please try again or toggle your Wi-Fi.' 
      };
    }
  },

  /**
   * Pulls all responses for the Admin Dashboard
   */
  getAllResponses: async (): Promise<FormResponse[]> => {
    try {
      const res = await robustFetch(`${CLOUD_URL}?nocache=${Date.now()}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Dashboard pull failed:", error);
      return [];
    }
  },

  /**
   * Resets the cloud data
   */
  clearResponses: async (): Promise<void> => {
    try {
      await robustFetch(CLOUD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([])
      });
    } catch (error) {
      console.error("Cloud wipe failed:", error);
    }
  }
};