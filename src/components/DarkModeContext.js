import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a Context for the dark mode state
const DarkModeContext = createContext();

// Create a provider component
export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Retrieve the initial state from localStorage or default to false
    return localStorage.getItem('dark-mode') === 'true';
  });

  useEffect(() => {
    // Apply the dark mode class to the body element
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Save the dark mode preference to localStorage
    localStorage.setItem('dark-mode', isDarkMode);
  }, [isDarkMode]);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// Custom hook to use the DarkModeContext
export const useDarkMode = () => useContext(DarkModeContext);
