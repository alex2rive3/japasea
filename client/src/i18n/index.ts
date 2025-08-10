import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import esCommon from '../locales/es/common.json';
import enCommon from '../locales/en/common.json';
import ptCommon from '../locales/pt/common.json';

import esAuth from '../locales/es/auth.json';
import enAuth from '../locales/en/auth.json';
import ptAuth from '../locales/pt/auth.json';

import esLanding from '../locales/es/landing.json';
import enLanding from '../locales/en/landing.json';
import ptLanding from '../locales/pt/landing.json';

import esHome from '../locales/es/home.json';
import enHome from '../locales/en/home.json';
import ptHome from '../locales/pt/home.json';

import esFavorites from '../locales/es/favorites.json';
import enFavorites from '../locales/en/favorites.json';
import ptFavorites from '../locales/pt/favorites.json';

import esProfile from '../locales/es/profile.json';
import enProfile from '../locales/en/profile.json';
import ptProfile from '../locales/pt/profile.json';

const resources = {
  es: {
    common: esCommon,
    auth: esAuth,
    landing: esLanding,
    home: esHome,
    favorites: esFavorites,
    profile: esProfile
  },
  en: {
    common: enCommon,
    auth: enAuth,
    landing: enLanding,
    home: enHome,
    favorites: enFavorites,
    profile: enProfile
  },
  pt: {
    common: ptCommon,
    auth: ptAuth,
    landing: ptLanding,
    home: ptHome,
    favorites: ptFavorites,
    profile: ptProfile
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    debug: false,
    
    ns: ['common', 'auth', 'landing', 'home', 'favorites', 'profile'],
    defaultNS: 'common',
    
    detection: {
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lang',
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
    
    interpolation: {
      escapeValue: false // React already does escaping
    }
  });

export default i18n;

// Export supported languages
export const supportedLanguages = ['es', 'en', 'pt'] as const;
export type SupportedLanguage = typeof supportedLanguages[number];

// Language labels for UI
export const languageLabels: Record<SupportedLanguage, string> = {
  es: 'Español',
  en: 'English',
  pt: 'Português'
};
