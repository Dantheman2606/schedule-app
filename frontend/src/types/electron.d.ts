// Type definitions for Electron integration
interface Window {
  electron?: {
    platform: string;
    env: {
      BACKEND_URL: string;
    };
  };
  API_CONFIG?: {
    baseURL: string;
  };
}
