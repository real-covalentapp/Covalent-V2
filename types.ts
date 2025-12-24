
export interface FormResponse {
  id: string;
  name: string;
  email: string;
  category: 'General' | 'Sales' | 'Support' | 'Feedback';
  message: string;
  timestamp: number;
  device: string;
}

export type AppView = 'intro' | 'form' | 'admin-login' | 'admin-dashboard';

export interface StorageResult {
  success: boolean;
  message: string;
}
