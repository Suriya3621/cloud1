import React from 'react';
import { CiLight } from "react-icons/ci";
import { MdDarkMode } from "react-icons/md";
import { useTheme } from '../../App/Theme.jsx';
import { useFont } from '../../App/FontContext.jsx';

function Settings() {
  const { darkMode, setDarkMode } = useTheme();
  const { font, setFont } = useFont();

  const handleFontChange = (e) => {
    setFont(e.target.value);
  };

  const fontOptions = [
    "Arial", "Courier New", "Georgia", "Times New Roman",
    "Verdana", "'Brush Script MT', cursive", "Lucida Console",
    "Garamond", "Palatino Linotype", "Comic Sans MS",
    "Trebuchet MS", "Impact", "Tahoma", "Segoe UI"
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="p-8 w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg space-y-6">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white text-center">Settings</h1>

        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-center space-x-4">
          <span className="text-lg font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(prev => !prev)}
              className="sr-only"
              aria-label="Toggle dark mode"
            />
            <div className="w-16 h-8 bg-gray-300 dark:bg-gray-600 rounded-full transition-colors duration-300"></div>
            <div
              className={`absolute w-8 h-8 rounded-full transition-transform duration-300 transform ${
                darkMode ? 'translate-x-8 bg-blue-500' : 'translate-x-0 bg-yellow-500'
              } flex items-center justify-center`}
            >
              {darkMode ? <CiLight className="text-white text-xl" /> : <MdDarkMode className="text-white text-xl" />}
            </div>
          </label>
        </div>

        {/* Font Selector */}
        <div className="space-y-2">
          <label className="block text-lg font-medium text-gray-700 dark:text-gray-300">
            Font Style:
          </label>
          <select
            value={font}
            onChange={handleFontChange}
            className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          >
            {fontOptions.map((fontOption) => (
              <option key={fontOption} value={fontOption} style={{ fontFamily: fontOption }}>
                {fontOption}
              </option>
            ))}
          </select>
        </div>
        
        {/* Save Changes Button */}
        <div className="flex justify-center">
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-300">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
