import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { MOBILE_BREAKPOINT } from "@/helpers/constants";
import Image from "next/image";
import useViewport from "@/hooks/useViewport";

type GalleryItem = {
  id: number;
  image: string;
  title: string;
  description: string;
};

type GalleryProps = {
  items: GalleryItem[];
};

const Gallery: React.FC<GalleryProps> = ({ items }) => {
  const [scrollIndex, setScrollIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4); // The pictures show on the srceen
  const scrollStep = 1; // Number of cards per scroll

  // Determine if it's mobile mode
  const { isMobile } = useViewport();
  
  // Dynamically update the number of cards displayed based on the window width.
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth <= MOBILE_BREAKPOINT) {
        setItemsPerView(1); // mobile mode show 1 picture
      } else {
        setItemsPerView(4); // PC mode show 4 picture
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);

    return () => {
      window.removeEventListener("resize", updateItemsPerView);
    };
  }, []);

  const handlePrev = () => {
    setScrollIndex((prev) => Math.max(prev - scrollStep, 0));
  };

  const handleNext = () => {
    setScrollIndex((prev) =>
      Math.min(prev + scrollStep, items.length - itemsPerView)
    );
  };

  return (
    <div className={styles.gallery}>
      {!isMobile && (
        <button
          onClick={handlePrev}
          className={styles.galleryButton}
          disabled={scrollIndex === 0}
        >
          &lt;
        </button>
      )}

      <div
        className={`${styles.galleryContainer} ${isMobile ? styles.mobileScroll : ""}`}
      >
        <div
          className={styles.galleryItems}
          style={{
            transform: !isMobile
              ? `translateX(-${scrollIndex * (100 / itemsPerView)}%)`
              : "none",
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className={styles.galleryItem}
              style={{ flex: `0 0 ${100 / itemsPerView}%` }}
            >
              <div className={styles.galleryImageWrapper}>
                <Image
                  src={item.image}
                  alt={item.title}
                  className={styles.galleryImage}
                  width={500}
                  height={500}
                  priority
                />
              </div>
              <h3 className={styles.galleryTitle}>{item.title}</h3>
              <p className={styles.galleryDescription}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {!isMobile && (
        <button
          onClick={handleNext}
          className={styles.galleryButton}
          disabled={scrollIndex === items.length - itemsPerView}
        >
          &gt;
        </button>
      )}
    </div>
  );
};

export default Gallery;
