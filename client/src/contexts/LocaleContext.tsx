import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { esES, enUS, ptBR } from '@mui/material/locale';
import { useTranslation } from 'react-i18next';
import type { SupportedLanguage } from '../i18n';

// Define locale mapping
const muiLocales = {
  es: esES,
  en: enUS,
  pt: ptBR
} as const;

interface LocaleContextType {
  currentLocale: SupportedLanguage;
  muiLocale: typeof esES;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

interface LocaleProviderProps {
  children: ReactNode;
  baseTheme: Theme;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({ 
  children, 
  baseTheme 
}) => {
  const { i18n } = useTranslation();
  const [currentLocale, setCurrentLocale] = useState<SupportedLanguage>(
    i18n.language as SupportedLanguage || 'es'
  );

  // Update locale when i18n language changes
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setCurrentLocale(lng as SupportedLanguage);
      // Update document language
      document.documentElement.lang = lng;
    };

    i18n.on('languageChanged', handleLanguageChange);
    
    // Set initial language
    handleLanguageChange(i18n.language);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const muiLocale = muiLocales[currentLocale] || esES;

  // Create theme with current locale
  const themeWithLocale = createTheme(baseTheme, muiLocale);

  const contextValue: LocaleContextType = {
    currentLocale,
    muiLocale
  };

  return (
    <LocaleContext.Provider value={contextValue}>
      <ThemeProvider theme={themeWithLocale}>
        {children}
      </ThemeProvider>
    </LocaleContext.Provider>
  );
};

export const useLocale = (): LocaleContextType => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};

export default LocaleProvider;
