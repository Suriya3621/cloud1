import React, { useState, useEffect } from 'react';
import { CiLight } from "react-icons/ci";
import { MdDarkMode } from "react-icons/md";
import { useTheme } from '../../App/Theme.js';

function Settings() {
  const { darkMode, setDarkMode } = useTheme();
  const [font, setFont] = useState(localStorage.getItem('font') || 'Arial');

  useEffect(() => {
    localStorage.setItem('font', font);
    document.documentElement.style.fontFamily = font;
  }, [font]);

  const handleFontChange = (e) => {
    setFont(e.target.value);
  };

  return (<>
    <div className="p-6 w-full absolute max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-6 dark:bg-gray-800">
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Settings</h1>

      {/* Dark Mode Toggle */}
      <div className="flex items-center space-x-4">
        <span className="text-lg font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(prev => !prev)}
            className="sr-only"
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
          <option value="Arial">Arial</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Verdana">Verdana</option>
          <option value="'Brush Script MT', cursive">Brush Script MT</option>
          {/* Add more font options as needed */}
        </select>
      </div>
    </div>
  </>);
}

export default Settings;