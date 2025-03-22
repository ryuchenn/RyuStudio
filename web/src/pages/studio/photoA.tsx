import React from "react";
import { images, tabContent } from "@/content/studioPhotoA";
import styles from "./css/photoA.module.scss";
import TabSection from "@/components/StudioTabSection";
import { useTranslation } from 'react-i18next';

const StudioPhotoA: React.FC = () => {
  const { t } = useTranslation(['translation', 'dynamicContent', 'commonVariables']);

  return (
    <TabSection
      images={images}
      tabContent={tabContent(t)}
      styles={styles}
      titleKey={t("translation:Studio.PhotoStudioTitle")}
    />
  );
};

export default StudioPhotoA;
