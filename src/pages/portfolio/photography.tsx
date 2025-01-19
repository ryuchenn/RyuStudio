import React from 'react';
import { photographyCategories, photographyAllImages } from "@/content/profolioCard";
import PortfolioCard from "@/components/PortfolioCard";
import { useTranslation } from 'react-i18next';

const PortfolioPhotography: React.FC = () => {
  const { t } = useTranslation(['translation', 'dynamicContent', 'commonVariables']); 

  return (
    <>
      <div>
        <PortfolioCard
          title={t("translation:Portfolio.Photography")}
          categories={photographyCategories.map((category) => category )}
          allImages={photographyAllImages}
        />
      </div>
    </>
  );
};

export default PortfolioPhotography;
