// import i18next from "i18next";
// import {initReactI18next} from "react-i18next";
// import en from "@/locales/en.json";
// import mm from "@/locales/mm.json";
// import th from "@/locales/th.json";

// i18next.use(initReactI18next).init({
//     lng: "en",
//     fallbackLng: "en",
//     debug: true,
//     interpolation: {
//         escapeValue: false,
//     },
//     resources: {
//         en: {translation: en},
//         mm: {translation: mm},
//         th: {translation: th}
//     },
// });

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translations manually
import enTranslation from "../locales/en/translation.json";
import thTranslation from "../locales/th/translation.json";

i18n
  .use(LanguageDetector) // Detect user's language
  .use(initReactI18next) // Bind i18next to React
  .init({
    resources: {
      en: { translation: enTranslation },
      th: { translation: thTranslation },
    },
    fallbackLng: "en", // Fallback language
    supportedLngs: ["en", "th"], // Languages supported
    debug: true, // Enable debug logs
    interpolation: {
      escapeValue: false, // React already escapes values to prevent XSS
    },
  });

export default i18n;
