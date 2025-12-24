
import { FormResponse, StorageResult } from '../types';

const STORAGE_KEY = 'cloudsubmit_responses';

/**
 * In a real-world scenario, these methods would call a backend API
 * (e.g., Firebase, AWS Lambda, or a dedicated Node.js server)
 * to ensure cross-device synchronization. 
 * 
 * For this implementation, we use localStorage to demonstrate the UI 
 * and data handling flow.
 */

export const storageService = {
  saveResponse: async (response: Omit<FormResponse, 'id' | 'timestamp' | 'device'>): Promise<StorageResult> => {
    try {
      // Simulate network latency
      await new Promise(resolve => setTimeout(resolve, 800));

      const existingData = localStorage.getItem(STORAGE_KEY);
      const responses: FormResponse[] = existingData ? JSON.parse(existingData) : [];
      
      const newResponse: FormResponse = {
        ...response,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        device: window.navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'
      };

      responses.unshift(newResponse);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
      
      return { success: true, message: 'Response submitted to the cloud successfully!' };
    } catch (error) {
      return { success: false, message: 'Failed to sync with cloud. Please try again.' };
    }
  },

  getAllResponses: async (): Promise<FormResponse[]> => {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 600));
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  clearResponses: async (): Promise<void> => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
