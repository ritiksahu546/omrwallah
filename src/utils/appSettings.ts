export interface AppSettings {
  scannerSensitivity: 'lenient' | 'medium' | 'strict';
  autoStraighten: boolean;
  defaultPaperSize: 'A4' | 'Letter' | 'Legal';
  defaultMarkingCorrect: number;
  defaultMarkingWrong: number;
  autoSaveCreator: boolean;
  emailReports: boolean;
  instantAlerts: boolean;
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  scannerSensitivity: 'medium',
  autoStraighten: true,
  defaultPaperSize: 'A4',
  defaultMarkingCorrect: 4,
  defaultMarkingWrong: -1,
  autoSaveCreator: true,
  emailReports: true,
  instantAlerts: true,
};

const STORAGE_KEY = 'omrwallah_app_settings';

export function loadAppSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_APP_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_APP_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_APP_SETTINGS,
      ...parsed,
    };
  } catch {
    return DEFAULT_APP_SETTINGS;
  }
}

export function saveAppSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save app settings:', e);
  }
}
