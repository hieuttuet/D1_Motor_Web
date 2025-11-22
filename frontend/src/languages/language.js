import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./resources/en.json";
import vi from "./resources/vi.json";
import ko from "./resources/ko.json";

i18n
  .use(LanguageDetector) // tự detect ngôn ngữ trình duyệt
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      vi: { translation: vi },
      ko: { translation: ko }
    },
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"], // ưu tiên localStorage
      caches: ["localStorage"]
    }
  });

export default i18n;
