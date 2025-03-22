import React from 'react';
import { musicCategories, allImages } from "@/content/profolioCard";
import PortfolioCard from "@/components/PortfolioCard";
import { useTranslation } from 'react-i18next';

const PortfolioMusic: React.FC = () => {
  const { t } = useTranslation(['translation', 'dynamicContent', 'commonVariables']); 
  const musicImages = allImages.filter(image => image.type === "Music");

  return (
    <>
      <div>
        <PortfolioCard
          title={t("translation:Portfolio.Music")}
          categories={musicCategories.map((category) => category )}
          allImages={musicImages}
        />
      </div>
    </>
  );
};

export default PortfolioMusic;
