import { useState } from 'react';
import { MdNotifications, MdSecurity, MdLanguage, MdPalette, MdPerson, MdEmail } from 'react-icons/md';
import { FaBell, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { IoColorPalette } from 'react-icons/io5';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      emailAlerts: true,
      pushNotifications: true,
      weeklyDigest: false,
      desktopNotifications: true
    },
    appearance: {
      theme: 'light',
      fontSize: 'medium',
      compactMode: false,
      animationsEnabled: true
    },
    language: 'English',
    security: {
      twoFactorAuth: false,
      loginAlerts: true,
      sessionTimeout: '30'
    }
  });

  const handleToggle = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
    toast.success(`${setting} ${!settings[category][setting] ? 'enabled' : 'disabled'}`);
  };

  const handleChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
    toast.success(`${setting} updated successfully`);
  };

  const SettingToggle = ({ enabled, onToggle }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
        enabled ? 'bg-sky' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const SettingSection = ({ title, icon: Icon, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-lg bg-sky bg-opacity-10">
          <Icon className="text-2xl text-sky" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Settings</h1>
        <p className="text-gray-500 text-sm">Customize your workspace preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications Section */}
        <SettingSection title="Notifications" icon={MdNotifications}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-700 font-medium">Email Alerts</h3>
                <p className="text-sm text-gray-500">Receive updates via email</p>
              </div>
              <SettingToggle
                enabled={settings.notifications.emailAlerts}
                onToggle={() => handleToggle('notifications', 'emailAlerts')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-700 font-medium">Push Notifications</h3>
                <p className="text-sm text-gray-500">Get instant push notifications</p>
              </div>
              <SettingToggle
                enabled={settings.notifications.pushNotifications}
                onToggle={() => handleToggle('notifications', 'pushNotifications')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-700 font-medium">Weekly Digest</h3>
                <p className="text-sm text-gray-500">Receive weekly summary reports</p>
              </div>
              <SettingToggle
                enabled={settings.notifications.weeklyDigest}
                onToggle={() => handleToggle('notifications', 'weeklyDigest')}
              />
            </div>
          </div>
        </SettingSection>

        {/* Appearance Section */}
        <SettingSection title="Appearance" icon={MdPalette}>
          <div className="space-y-4">
            <div>
              <h3 className="text-gray-700 font-medium mb-2">Theme</h3>
              <select
                value={settings.appearance.theme}
                onChange={(e) => handleChange('appearance', 'theme', e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
            <div>
              <h3 className="text-gray-700 font-medium mb-2">Font Size</h3>
              <select
                value={settings.appearance.fontSize}
                onChange={(e) => handleChange('appearance', 'fontSize', e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-700 font-medium">Compact Mode</h3>
                <p className="text-sm text-gray-500">Use condensed spacing</p>
              </div>
              <SettingToggle
                enabled={settings.appearance.compactMode}
                onToggle={() => handleToggle('appearance', 'compactMode')}
              />
            </div>
          </div>
        </SettingSection>

        {/* Security Section */}
        <SettingSection title="Security" icon={MdSecurity}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-700 font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500">Add an extra layer of security</p>
              </div>
              <SettingToggle
                enabled={settings.security.twoFactorAuth}
                onToggle={() => handleToggle('security', 'twoFactorAuth')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-700 font-medium">Login Alerts</h3>
                <p className="text-sm text-gray-500">Get notified of new sign-ins</p>
              </div>
              <SettingToggle
                enabled={settings.security.loginAlerts}
                onToggle={() => handleToggle('security', 'loginAlerts')}
              />
            </div>
            <div>
              <h3 className="text-gray-700 font-medium mb-2">Session Timeout</h3>
              <select
                value={settings.security.sessionTimeout}
                onChange={(e) => handleChange('security', 'sessionTimeout', e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
              </select>
            </div>
          </div>
        </SettingSection>

        {/* Language Section */}
        <SettingSection title="Language & Region" icon={MdLanguage}>
          <div className="space-y-4">
            <div>
              <h3 className="text-gray-700 font-medium mb-2">Display Language</h3>
              <select
                value={settings.language}
                onChange={(e) => handleChange('language', e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Chinese">Chinese</option>
                <option value="Japanese">Japanese</option>
              </select>
            </div>
            <div className="p-4 bg-sky bg-opacity-5 rounded-lg">
              <p className="text-sm text-gray-600">
                Language changes will be applied after refreshing the page
              </p>
            </div>
          </div>
        </SettingSection>
      </div>

      {/* Save Changes Button */}
      <div className="flex justify-end">
        <button className="px-6 py-2 bg-sky text-white rounded-lg hover:bg-sky-600 transition-all duration-300 shadow-sm hover:shadow-md">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default AdminSettings; 