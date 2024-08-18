import React, { useState } from 'react';
import Menu from '../components/Header';
import TopHeader from '../components/TopHeader';
import Footer from '../components/Footer';
import ReactFlagsSelect from 'react-flags-select';
import { useDarkMode } from '../components/DarkModeContext'; // Adjust the path accordingly

const Settings = () => {
  const { isDarkMode, setIsDarkMode } = useDarkMode();
  const [selectedLanguage, setSelectedLanguage] = useState('US'); // Default language is English (US)

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const handleLanguageChange = (code) => {
    setSelectedLanguage(code);
    console.log(`Selected language: ${code}`);
  };

  return (
    <div className={`min-h-screen flex font-montserrat ${isDarkMode ? 'dark' : ''} bg-gray-100 dark:bg-gray-800 text-darkText dark:text-lightText transition-colors duration-300`}>
      <Menu />
      <main className="flex-1 2xl:pl-[16rem]">
        <TopHeader />
        <div className="p-6 min-h-[84.2vh]">
          <div className="flex justify-left items-center mb-4 gap-4 items-center">
            <h1 className="text-xl font-bold">Settings</h1>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white dark:bg-secondary rounded-lg shadow-md p-5 transition-colors duration-300">
              {/* Change Language */}
              <div className="mb-6">
                <span className="font-semibold mb-2 block">Change Language</span>
                <ReactFlagsSelect
                  selected={selectedLanguage}
                  onSelect={handleLanguageChange}
                  countries={["US", "PL", "ES", "FR"]}
                  customLabels={{"US": "English", "PL": "Polski", "ES": "Español", "FR": "Français"}}
                  placeholder="Select Language"
                  className="w-full bg-gray-50 dark:bg-secondary dark:text-lightText border-gray-300 dark:border-accent rounded-md dropdown-se"
                  selectButtonClassName="bg-gray-50 dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                  selectMenuClassName="bg-gray-50 dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                />
              </div>

              {/* Switch to Dark Mode */}
              <div className="mb-6">
                <span className="font-semibold mb-2 block">Dark Mode</span>
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={isDarkMode} 
                        onChange={toggleDarkMode} 
                        className="sr-only"
                      />
                      <div className={`block w-14 h-8 rounded-full transition-colors duration-300 ${isDarkMode ? 'bg-red-500' : 'bg-gray-200 dark:bg-accent'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white dark:bg-secondary w-6 h-6 rounded-full transition-transform duration-300 transform ${isDarkMode ? 'translate-x-6' : ''}`}></div>
                    </div>
                    <span className="ml-3 text-lg font-medium">{isDarkMode ? 'Dark Mode Enabled' : 'Enable Dark Mode'}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Settings;
