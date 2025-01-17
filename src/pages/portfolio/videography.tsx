import React from 'react';
import { videographyCategories, videographyAllImages } from "@/content/profoliocard";
import PortfolioCard from "@/components/PortfolioCard";
import { useTranslation } from 'react-i18next';

const PortfolioVideography: React.FC = () => {
  const { t } = useTranslation(['translation', 'dynamicContent', 'commonVariables']); 

  return (
    <>
      <div>
        <PortfolioCard
          title={t("translation:Portfolio.Videography")}
          categories={videographyCategories.map((category) => t(`translation:Portfolio.${category}`))}
          allImages={videographyAllImages}
        />
      </div>
    </>
  );
};

export default PortfolioVideography;