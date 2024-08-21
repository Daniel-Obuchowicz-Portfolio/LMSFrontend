import React, { useState, useEffect, useRef } from 'react';
import Menu from '../components/Header';
import TopHeader from '../components/TopHeader';
import Footer from '../components/Footer';
import ReactFlagsSelect from 'react-flags-select';
import { useDarkMode } from '../components/DarkModeContext'; 
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";
import { useTranslation } from 'react-i18next';
import i18n from '../components/i18n';

const Settings = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
      setSidebarOpen(!sidebarOpen);
  };

  const [isLoaded, setIsLoaded] = useState(false); // Dodajemy stan kontrolujący załadowanie ustawień
  const { isDarkMode, setIsDarkMode } = useDarkMode();
  const [selectedLanguage, setSelectedLanguage] = useState('US');
  const { t } = useTranslation();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
      const languageMapReverse = {
        'en': 'US',
        'pl': 'PL',
        'es': 'ES',
        'fr': 'FR'
      };
      setSelectedLanguage(languageMapReverse[savedLanguage]);
    }

    setIsDarkMode(savedDarkMode);
    setIsLoaded(true); // Ustawiamy na true, kiedy ustawienia są załadowane
  }, [setIsDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => {
      localStorage.setItem('darkMode', !prevMode);
      return !prevMode;
    });
  };

  const handleLanguageChange = (code) => {
    setSelectedLanguage(code);

    const languageMap = {
      'US': 'en',
      'PL': 'pl',
      'ES': 'es',
      'FR': 'fr'
    };

    const selectedLang = languageMap[code];
    i18n.changeLanguage(selectedLang);
    localStorage.setItem('language', selectedLang);
  };

  if (!isLoaded) {
    return null; // Renderujemy nic, dopóki ustawienia się nie załadują
  }

  return (
    <div className={`min-h-screen flex font-montserrat ${isDarkMode ? 'dark' : ''} bg-gray-100 dark:bg-gray-800 text-darkText dark:text-lightText transition-colors duration-300`}>
      <Menu sidebar={sidebarOpen} toggleSidebar={toggleSidebar} sidebarRef={sidebarRef} />
      <main className="flex-1 xl:pl-[16rem]">
        <TopHeader toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
        <div className="p-6 min-h-[84.2vh]">
          <div className="md:flex items-center mb-6 gap-4">
          <button
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex gap-2 items-center text-sm md:text-base mb-4 md:mb-0"
              onClick={() => navigate(-1)}
            >
              <IoIosArrowBack /> {t('Back')}
            </button>
            <h1 className="text-xl font-bold">{t('Settings')}</h1>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white dark:bg-secondary rounded-lg shadow-md p-5 transition-colors duration-300">
              <div className="mb-6">
                <span className="font-semibold mb-2 block">{t('Change Language')}</span>
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

              <div className="mb-6">
                <span className="font-semibold mb-2 block">{t('Dark Mode')}</span>
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
                    <span className="ml-3 text-lg font-medium">{isDarkMode ? t('Dark Mode Enabled') : t('Enable Dark Mode')}</span>
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
