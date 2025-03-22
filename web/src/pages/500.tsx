import { useTranslation } from 'react-i18next';

export default function Error() {
  const { t } = useTranslation(['translation', 'dynamicContent', 'commonVariables']);
  
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center", fontSize: "2.5rem", fontWeight: "bold" }}>
        {t("commonVariables:SystemConfig.500")}
      </h2>
    </div>
  );
}
