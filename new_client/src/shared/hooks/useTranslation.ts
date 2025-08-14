import { useTranslation } from 'react-i18next';
import { changeLanguage, getCurrentLanguage, isLanguageSupported } from '../i18n';
import type { SupportedLanguage, SupportedNamespace } from '../i18n';

// Custom hook for type-safe translations
export const useAppTranslation = (namespace?: SupportedNamespace) => {
  const { t, i18n } = useTranslation(namespace);
  
  const currentLanguage = getCurrentLanguage();
  
  const handleLanguageChange = (lang: SupportedLanguage) => {
    return changeLanguage(lang);
  };
  
  return {
    t,
    i18n,
    currentLanguage,
    changeLanguage: handleLanguageChange,
    isLanguageSupported,
  };
};

// Hook specifically for common translations (most used)
export const useCommonTranslation = () => {
  return useAppTranslation('common');
};

// Hook for auth-related translations
export const useAuthTranslation = () => {
  return useAppTranslation('auth');
};
