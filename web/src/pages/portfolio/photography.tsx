import React from 'react';
import { photographyCategories, allImages } from "@/content/profolioCard";
import PortfolioCard from "@/components/PortfolioCard";
import { useTranslation } from 'react-i18next';

const PortfolioPhotography: React.FC = () => {
  const { t } = useTranslation(['translation', 'dynamicContent', 'commonVariables']); 
  const photographyImages = allImages.filter(image => image.type === "Photography");

  return (
    <>
      <div>
        <PortfolioCard
          title={t("translation:Portfolio.Photography")}
          categories={photographyCategories.map((category) => category )}
          allImages={photographyImages}
        />
      </div>
    </>
  );
};

export default PortfolioPhotography;
