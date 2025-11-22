import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import enPng from "./flags/en.png";
import viPng from "./flags/vi.png";
import koPng from "./flags/ko.png";
import "./languageSwitcher.css";

// Danh sách ngôn ngữ (label sẽ dịch bằng i18n)
const LANGUAGES = [
  { code: "en", flag: enPng },
  { code: "vi", flag: viPng },
  { code: "ko", flag: koPng }
];

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  const changeLanguage = (code) => {
    localStorage.setItem("i18nextLng", code);
    i18n.changeLanguage(code);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="lang-switcher" ref={wrapperRef}>
      <div className="current-lang" onClick={() => setOpen(prev => !(prev))}>
        <img src={currentLang.flag} alt={currentLang.code} />
      </div>

      {open && (
        <div className="lang-menu">
          {LANGUAGES.map(lang => (
            <div
              key={lang.code}
              className={`lang-item ${lang.code === currentLang.code ? "active" : ""}`}
              onClick={() => changeLanguage(lang.code)}
            >
              <img src={lang.flag} alt={lang.code} />
              <span>{t(`language.${lang.code}`)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
