import { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("English");
  const [location, setLocation] = useState(null); // 🌍 Global location state

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, location, setLocation }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
