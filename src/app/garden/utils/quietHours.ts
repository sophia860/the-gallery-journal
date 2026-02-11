// Quiet Hours system for The Garden
import { storage } from './storage';

export interface QuietHours {
  enabled: boolean;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  daysOfWeek: number[]; // 0-6, where 0 is Sunday
}

const QUIET_HOURS_KEY = 'garden_quiet_hours';

export const quietHoursService = {
  // Get quiet hours settings
  getQuietHours: (): QuietHours => {
    return storage.get<QuietHours>(QUIET_HOURS_KEY) || {
      enabled: false,
      startTime: '22:00',
      endTime: '07:00',
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6] // All days
    };
  },

  // Update quiet hours settings
  updateQuietHours: (settings: Partial<QuietHours>): QuietHours => {
    const current = quietHoursService.getQuietHours();
    const updated = { ...current, ...settings };
    storage.set(QUIET_HOURS_KEY, updated);
    return updated;
  },

  // Check if currently in quiet hours
  isQuietTime: (): boolean => {
    const settings = quietHoursService.getQuietHours();
    
    if (!settings.enabled) return false;

    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Check if today is in the enabled days
    if (!settings.daysOfWeek.includes(currentDay)) return false;

    // Parse times
    const [startHour, startMin] = settings.startTime.split(':').map(Number);
    const [endHour, endMin] = settings.endTime.split(':').map(Number);
    const [currentHour, currentMin] = currentTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const currentMinutes = currentHour * 60 + currentMin;

    // Handle cases where end time is on the next day
    if (endMinutes < startMinutes) {
      return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
    }

    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  }
};
