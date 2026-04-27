import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const savedLanguage = typeof window !== "undefined" ? window.localStorage.getItem("nete-lang") : null;
const initialLanguage = savedLanguage?.toLowerCase().startsWith("en") ? "en" : "zh";

void i18n.use(initReactI18next).init({
  resources: {
    zh: { translation: {} },
    en: { translation: {} },
  },
  lng: initialLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
