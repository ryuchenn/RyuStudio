import React from 'react';
import { musicCategories, musicAllImages } from "@/content/profoliocard";
import PortfolioCard from "@/components/PortfolioCard";
import { useTranslation } from 'react-i18next';

const PortfolioMusic: React.FC = () => {
  const { t } = useTranslation(['translation', 'dynamicContent', 'commonVariables']); 

  return (
    <>
      <div>
        <PortfolioCard
          title={t("translation:Portfolio.Music")}
          categories={musicCategories.map((category) => t(`translation:Portfolio.${category}`))}
          allImages={musicAllImages}
        />
      </div>
    </>
  );
};

export default PortfolioMusic;
