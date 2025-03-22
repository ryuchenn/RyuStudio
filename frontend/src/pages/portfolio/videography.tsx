import React from 'react';
import { videographyCategories, allImages } from "@/content/profolioCard";
import PortfolioCard from "@/components/PortfolioCard";
import { useTranslation } from 'react-i18next';

const PortfolioVideography: React.FC = () => {
  const { t } = useTranslation(['translation', 'dynamicContent', 'commonVariables']); 
  const videographyImages = allImages.filter(image => image.type === "Videography");

  return (
    <>
      <div>
        <PortfolioCard
          title={t("translation:Portfolio.Videography")}
          categories={videographyCategories.map((category) => category )}
          allImages={videographyImages}
        />
      </div>
    </>
  );
};

export default PortfolioVideography;