import { useLanguage } from "./LanguageContext";

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className="p-2 rounded border"
    >
      <option value="English">English</option>
      <option value="Telugu">తెలుగు</option>
      <option value="Hindi">हिन्दी</option>
      <option value="Kannada">ಕನ್ನಡ</option>
    </select>
  );
};

export default LanguageSelector;
