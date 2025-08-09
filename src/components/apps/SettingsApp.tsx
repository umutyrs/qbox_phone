import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight, Wifi, Bluetooth, Volume2, Bell, Lock, User, Smartphone, Battery } from 'lucide-react';
import { AppProps } from '../../types/App';

interface Setting {
  id: string;
  label: string;
  icon: React.ReactNode;
  type: 'toggle' | 'slider' | 'navigation';
  value?: boolean | number;
  action?: () => void;
}

export const SettingsApp: React.FC<AppProps> = ({ onClose }) => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [view, setView] = useState<'main' | 'profile'>('main');

  // FiveM API calls
  const updateSetting = async (settingId: string, value: boolean | number) => {
    try {
      await fetch('http://localhost:30120/phone/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'player',
          action: 'update_setting',
          setting: settingId,
          value: value
        })
      });
    } catch (error) {
      console.error('Failed to update setting:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('http://localhost:30120/phone/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'player',
          action: 'get_settings'
        })
      });
      const data = await response.json();
      
      // Merge with default settings
      const defaultSettings = getDefaultSettings();
      const mergedSettings = defaultSettings.map(setting => ({
        ...setting,
        value: data.settings?.[setting.id] ?? setting.value
      }));
      
      setSettings(mergedSettings);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      setSettings(getDefaultSettings());
    }
  };

  const getDefaultSettings = (): Setting[] => [
    {
      id: 'wifi',
      label: 'Wi-Fi',
      icon: <Wifi size={20} />,
      type: 'toggle',
      value: true
    },
    {
      id: 'bluetooth',
      label: 'Bluetooth',
      icon: <Bluetooth size={20} />,
      type: 'toggle',
      value: false
    },
    {
      id: 'volume',
      label: 'Volume',
      icon: <Volume2 size={20} />,
      type: 'slider',
      value: 75
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell size={20} />,
      type: 'toggle',
      value: true
    },
    {
      id: 'privacy',
      label: 'Privacy & Security',
      icon: <Lock size={20} />,
      type: 'navigation',
      action: () => console.log('Open privacy settings')
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User size={20} />,
      type: 'navigation',
      action: () => setView('profile')
    },
    {
      id: 'device',
      label: 'Device Info',
      icon: <Smartphone size={20} />,
      type: 'navigation',
      action: () => console.log('Open device info')
    },
    {
      id: 'battery',
      label: 'Battery',
      icon: <Battery size={20} />,
      type: 'navigation',
      action: () => console.log('Open battery settings')
    }
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleToggle = (settingId: string) => {
    setSettings(prev => prev.map(setting => {
      if (setting.id === settingId && setting.type === 'toggle') {
        const newValue = !setting.value;
        updateSetting(settingId, newValue);
        return { ...setting, value: newValue };
      }
      return setting;
    }));
  };

  const handleSliderChange = (settingId: string, value: number) => {
    setSettings(prev => prev.map(setting => {
      if (setting.id === settingId && setting.type === 'slider') {
        updateSetting(settingId, value);
        return { ...setting, value };
      }
      return setting;
    }));
  };

  const ToggleSwitch: React.FC<{ enabled: boolean; onChange: () => void }> = ({ enabled, onChange }) => (
    <button
      onClick={onChange}
      className={`w-12 h-6 rounded-full transition-colors ${
        enabled ? 'bg-blue-600' : 'bg-gray-600'
      }`}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-0.5'
        }`}
      />
    </button>
  );

  const Slider: React.FC<{ value: number; onChange: (value: number) => void }> = ({ value, onChange }) => (
    <div className="w-24">
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
      />
    </div>
  );

  return (
    <div className="absolute inset-0 bg-black z-50 flex flex-col text-white">
      {/* Header */}
      <div className="p-4 pt-12">
        <div className="flex items-center justify-between">
          <button onClick={view === 'main' ? onClose : () => setView('main')}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-semibold">
            {view === 'main' ? 'Settings' : 'Profile'}
          </h1>
          <div className="w-6" />
        </div>
      </div>

      {view === 'main' ? (
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-1">
            {settings.map((setting) => (
              <div
                key={setting.id}
                className="flex items-center justify-between p-4 hover:bg-gray-900 active:bg-gray-800"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-blue-500">{setting.icon}</div>
                  <span className="font-medium">{setting.label}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {setting.type === 'toggle' && (
                    <ToggleSwitch
                      enabled={setting.value as boolean}
                      onChange={() => handleToggle(setting.id)}
                    />
                  )}
                  
                  {setting.type === 'slider' && (
                    <>
                      <Slider
                        value={setting.value as number}
                        onChange={(value) => handleSliderChange(setting.id, value)}
                      />
                      <span className="text-sm text-gray-400 w-8">
                        {setting.value}%
                      </span>
                    </>
                  )}
                  
                  {setting.type === 'navigation' && (
                    <button onClick={setting.action}>
                      <ChevronRight size={20} className="text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 p-4">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User size={40} />
            </div>
            <h2 className="text-xl font-semibold">John Doe</h2>
            <p className="text-gray-400">Citizen ID: #12345</p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Personal Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Phone Number:</span>
                  <span>555-0123</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Bank Account:</span>
                  <span>$12,450</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Job:</span>
                  <span>Taxi Driver</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Game Statistics</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Play Time:</span>
                  <span>127 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Level:</span>
                  <span>25</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Reputation:</span>
                  <span>Good Citizen</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};