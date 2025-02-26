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

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleImages, setVisibleImages] = useState(10); // Initial display
  const [loadedImages, setLoadedImages] = useState<number[]>([]); // Track loaded images

  // Handle image loading effect
  const handleImageLoad = (id: number) => {
    setLoadedImages((prev) => [...prev, id]);
  };

  // Handle Load More button
  const handleLoadMore = () => {
    setVisibleImages((prev) => prev + 10);
  };

  // Filter images based on category selection
  const filteredImages =
    selectedCategory === "All"
      ? allImages
      : allImages.filter((img) => img.category.includes(selectedCategory));

  // Click image to go to detail page
  const handleImageClick = (id: number, category: string[]) => {
    router.push(`/portfolio/${category[0].toLowerCase()}/${id}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>

      {/* Category selection */}
      <div className={styles.categoryWrapper}>
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

      {/* Image grid */}
      <div className={styles.imageGrid}>
        {filteredImages.slice(0, visibleImages).map((image) => (
          <div
            key={image.id}
            onClick={() => handleImageClick(image.id, image.category)}
            className={`${styles.imageItem} ${loadedImages.includes(image.id) ? styles.fadeIn : ""}`}
          >
            <Image 
              src={image.src} 
              alt={image.title} 
              className={styles.image}
              width={500} 
              height={500} 
              priority 
              onLoad={() => handleImageLoad(image.id)}
            />
            <div className={styles.overlay}>
              <span className={styles.overlayText}>{image.title}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {visibleImages < filteredImages.length && (
        <div className={styles.loadMoreContainer}>
          <button onClick={handleLoadMore} className={styles.loadMoreButton}>
            {t("translation:Portfolio.LoadMore")}
          </button>
        </div>
      )}
    </div>
  );
};

export default PortfolioCard;
