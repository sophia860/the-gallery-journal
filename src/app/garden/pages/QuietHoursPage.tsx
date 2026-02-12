import { useState, useEffect } from 'react';
import { GardenNav } from '../components/GardenNav';
import { useAuth } from '../../contexts/AuthContext';
import { quietHoursService, QuietHours } from '../utils/quietHours';

export function QuietHoursPage() {
    const { user: currentUser } = useAuth();
  const [settings, setSettings] = useState<QuietHours>(quietHoursService.getQuietHours());
  const [saved, setSaved] = useState(false);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    if (!currentUser) {
      window.location.href = '/garden/login';
    }
  }, [currentUser]);

  const handleToggle = () => {
    const updated = { ...settings, enabled: !settings.enabled };
    setSettings(updated);
    quietHoursService.updateQuietHours(updated);
    showSavedMessage();
  };

  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    const updated = { ...settings, [field]: value };
    setSettings(updated);
    quietHoursService.updateQuietHours(updated);
    showSavedMessage();
  };

  const handleDayToggle = (day: number) => {
    const updated = {
      ...settings,
      daysOfWeek: settings.daysOfWeek.includes(day)
        ? settings.daysOfWeek.filter(d => d !== day)
        : [...settings.daysOfWeek, day].sort()
    };
    setSettings(updated);
    quietHoursService.updateQuietHours(updated);
    showSavedMessage();
  };

  const showSavedMessage = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      <GardenNav />
      
      <div className="pt-24 px-8 pb-16">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-['Cardo'] italic text-4xl text-[#7a9b76] mb-2">
              Quiet Hours
            </h1>
            <p className="font-['Cardo'] text-[#e0e0e0]/60">
              Set boundaries for your writing practice
            </p>
          </div>

          {/* Saved indicator */}
          {saved && (
            <div className="mb-6 p-3 bg-[#7a9b76]/20 border border-[#7a9b76] rounded text-[#7a9b76] text-sm text-center">
              ✓ Settings saved
            </div>
          )}

          {/* Enable/Disable Toggle */}
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-['Cardo'] text-xl text-[#e0e0e0] mb-2">
                  Enable Quiet Hours
                </h3>
                <p className="font-['Georgia'] text-sm text-[#e0e0e0]/60">
                  During quiet hours, The Garden shows a minimal interface
                </p>
              </div>
              <button
                onClick={handleToggle}
                className={`relative w-14 h-8 rounded-full transition-colors cursor-pointer ${
                  settings.enabled ? 'bg-[#7a9b76]' : 'bg-[#333]'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.enabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Time Settings */}
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 mb-6">
            <h3 className="font-['Cardo'] text-xl text-[#7a9b76] mb-6">
              Time Range
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/70 mb-3">
                  Start Time
                </label>
                <input
                  type="time"
                  value={settings.startTime}
                  onChange={(e) => handleTimeChange('startTime', e.target.value)}
                  className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-[#e0e0e0] focus:border-[#7a9b76] focus:outline-none transition-colors cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/70 mb-3">
                  End Time
                </label>
                <input
                  type="time"
                  value={settings.endTime}
                  onChange={(e) => handleTimeChange('endTime', e.target.value)}
                  className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-[#e0e0e0] focus:border-[#7a9b76] focus:outline-none transition-colors cursor-pointer"
                />
              </div>
            </div>

            <p className="mt-4 text-sm text-[#e0e0e0]/40">
              {settings.startTime > settings.endTime
                ? 'Quiet hours will span across midnight'
                : `Quiet hours: ${settings.startTime} - ${settings.endTime}`}
            </p>
          </div>

          {/* Days of Week */}
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 mb-6">
            <h3 className="font-['Cardo'] text-xl text-[#7a9b76] mb-6">
              Active Days
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {dayNames.map((day, index) => (
                <button
                  key={index}
                  onClick={() => handleDayToggle(index)}
                  className={`px-4 py-3 rounded font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] transition-colors cursor-pointer ${
                    settings.daysOfWeek.includes(index)
                      ? 'bg-[#7a9b76] text-white'
                      : 'bg-[#121212] border border-[#333] text-[#e0e0e0] hover:border-[#7a9b76]'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <h3 className="font-['Cardo'] text-xl text-[#7a9b76] mb-4">
              🌙 How Quiet Hours Work
            </h3>
            <div className="space-y-3 font-['Georgia'] text-sm text-[#e0e0e0]/70 leading-relaxed">
              <p>
                During your quiet hours, The Garden will show a minimal banner at the top of the page, 
                reminding you that you're in a focused time.
              </p>
              <p>
                This is your time to write without distractions. The interface remains fully functional, 
                but the visual cue helps maintain your boundaries.
              </p>
              <p>
                Use quiet hours to protect your creative energy and establish a healthy relationship 
                with your writing practice.
              </p>
            </div>
          </div>

          {/* Current Status */}
          {settings.enabled && (
            <div className="mt-6 p-4 bg-[#7a9b76]/10 border border-[#7a9b76]/30 rounded text-center">
              <p className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#7a9b76]">
                {quietHoursService.isQuietTime()
                  ? '🌙 Currently in Quiet Hours'
                  : '☀️ Quiet Hours Not Active'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
