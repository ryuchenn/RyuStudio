import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (locale: string) => {
    i18n.changeLanguage(locale);
  };

  return (
    <div>
      <select
        className="border border-gray-300 rounded-md p-2 bg-white"
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
      >
        <option value="en">English</option>
        <option value="zh">中文</option>
        <option value="fr">Français</option>
        <option value="es">Español</option>
        <option value="ja">日本語</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
