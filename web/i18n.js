import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

// init language switcher module
i18n
  .use(HttpBackend) 
  .use(LanguageDetector) // Auto detect user language mode
  .use(initReactI18next) 
  .init({
    fallbackLng: 'en', // default language
    debug: false, 
    ns: ['translation', 'dynamicContent', 'commonVariables'],
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: (lng, ns) => {
        if (ns == "commonVariables") {
          return '/locales/common/commonVariables.json'; // Common language module
        }
        else{
          return `/locales/${lng}/${ns}.json`; // Different language module
        }
      },
    },
  });

export default i18n;
