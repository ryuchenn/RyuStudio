import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface TabSectionProps {
  images: string[];
  tabContent: Record<string, React.ReactNode>;
  styles: Record<string, string>;
  titleKey: string;
}

const TabSection: React.FC<TabSectionProps> = ({ images, tabContent, styles, titleKey }) => {
  const { t } = useTranslation(['translation', 'dynamicContent', 'commonVariables']);

  // The background image status
  const [currentImage, setCurrentImage] = useState(0);

  // Tab content
  const [activeTab, setActiveTab] = useState<string>(Object.keys(tabContent)[0]);

  // Change image effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 4000); // change image per 4 second
    return () => clearInterval(interval); 
  }, [images.length]);

  return (
    <div className={styles.container}>
      {/* Background image container */}
      <div className={styles.hero}>
        {images.map((image, index) => (
          <div
            key={index}
            className={`${styles.heroImage} ${index === currentImage ? styles.active : ""}`}
            style={{ backgroundImage: `url(${image})` }}
          ></div>
        ))}
        <div className={styles.heroOverlay}>
          <h1 className={styles.heroText}>{t(titleKey)}</h1>
        </div>
      </div>

      {/* Tab controller */}
      <div className={styles.tabContainer}>
        {/* Mobile: dropdown menu */}
        <select
          className={styles.dropdown}
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
        >
          {Object.keys(tabContent).map((tab) => (
            <option key={tab} value={tab}>
              {t(`translation:Studio.${tab}`)}
            </option>
          ))}
        </select>

        {/* PC */}
        <div className={styles.buttonGroup}>
          {Object.keys(tabContent).map((tab) => (
            <button
              key={tab}
              className={`${styles.tabButton} ${activeTab === tab ? styles.activeTab : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {t(`translation:Studio.${tab}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className={styles.tabContent}>
        <div className={styles.tabContentInner}>{tabContent[activeTab]}</div>
      </div>
    </div>
  );
};

export default TabSection;
