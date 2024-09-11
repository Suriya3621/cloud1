// FontContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context
const FontContext = createContext();

export const useFont = () => useContext(FontContext);

export const FontProvider = ({ children }) => {
  const [font, setFont] = useState(localStorage.getItem('font') || 'Arial');

  useEffect(() => {
    localStorage.setItem('font', font);
    document.documentElement.style.fontFamily = font;
  }, [font]);

  return (
    <FontContext.Provider value={{ font, setFont }}>
      {children}
    </FontContext.Provider>
  );
};