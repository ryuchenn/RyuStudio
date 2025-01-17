import React, { useState } from 'react';
import { useRouter } from "next/router";
import styles from "./index.module.scss";

type PortfolioCardProps = {
  title: string;
  categories: string[];
  allImages: { id: string; category: string[]; src: string; title: string }[];
};

const PortfolioCard: React.FC<PortfolioCardProps> = ({ title, categories, allImages }) => {
  const router = useRouter();

  // The category that user choose 
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter image
  const filteredImages =
    selectedCategory === "All"
      ? allImages
      : allImages.filter((img) => img.category.includes(selectedCategory));

  // Click the image to the detailed page
  const handleImageClick = (id: string, category: string[]) => {
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
              {cat}
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
                {cat}
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
            <img
              src={image.src}
              alt={image.title}
              className={styles.image}
            />
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
