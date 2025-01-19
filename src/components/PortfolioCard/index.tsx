import React, { useState } from 'react';
import { useRouter } from "next/router";
import styles from "./index.module.scss";
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

type PortfolioCardProps = {
  title: string;
  categories: string[];
  allImages: { id: number; category: string[]; src: string; title: string }[];
};

const PortfolioCard: React.FC<PortfolioCardProps> = ({ title, categories, allImages }) => {
  const { t } = useTranslation(['translation', 'dynamicContent', 'commonVariables']); 
  const router = useRouter();

  // The category that user choose 
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter image
  const filteredImages =
    selectedCategory === "All"
      ? allImages
      : allImages.filter((img) => img.category.includes(selectedCategory));

  // Click the image to the detailed page
  const handleImageClick = (id: number, category: string[]) => {
    router.push(`/portfolio/${category[0].toLowerCase()}/${id}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>

      {/* Filter: select and dropdown menu */}
      <div className={styles.categoryWrapper}>
        {/* PC mode button */}
        <div className={`${styles.categoryButtons} ${styles.hiddenOnMobile}`}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`${styles.categoryButton} ${selectedCategory === cat ? styles.selected : ""}`}
            >
              {t(`translation:Portfolio.${cat}`)}
            </button>
          ))}
        </div>

        {/* mobile mode button */}
        <div className="md:hidden">
          <select
            className={styles.categoryDropdown}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {t(`translation:Portfolio.${cat}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Picture list */}
      <div className={styles.imageGrid}>
        {filteredImages.map((image) => (
          <div
            key={image.id}
            onClick={() => handleImageClick(image.id, image.category)}
            className={styles.imageItem}
          >
            <Image 
              src={image.src} alt={image.title} className={styles.image}
              width={500} height={500} priority
            ></Image>
            <div className={styles.overlay}>
              <span className={styles.overlayText}>{image.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioCard;
