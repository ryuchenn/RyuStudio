import React from "react";
import { images, tabContent } from "@/content/studioMusicA";
import styles from "./css/musicA.module.scss";
import { useTranslation } from 'react-i18next';
import TabSection from "@/components/StudioTabSection";

const StudioMusicA: React.FC = () => {
    const { t } = useTranslation(['translation', 'dynamicContent', 'commonVariables']);

    return (
        <>
            <TabSection
                images={images}
                tabContent={tabContent(t)}
                styles={styles}
                titleKey={t("translation:Studio.MusicStudioTitle")}
            />
        </>
    );
};

export default StudioMusicA;
