import { useRouter } from "next/router";
import { detailAllImages } from "@/content/profoliocard";
import styles from "./index.module.scss";
import { useTranslation } from 'react-i18next';

const ImageDetailsPage = () => {
  const { t } = useTranslation(['translation', 'dynamicContent', 'commonVariables']); 
  const router = useRouter();
  const { category, id } = router.query;

  // Find detailed image by ID
  const imageSet = detailAllImages.find((img) => img.id === id);

  if (!imageSet) {
    return <p>{t("translation:Portfolio.NotFound")}</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{imageSet.title}</h1>
      
      {/* Images show from top to bottom */}
      <div className={styles.imageList}>
        {imageSet.images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`${imageSet.title} ${index + 1}`}
            className={styles.imageItem}
          />
        ))}
      </div>
      
      {/* <div className={styles.relatedImages}>
        {allImages
          .filter((img) => img.category === category && img.id !== id)
          .map((related) => (
            <div
              key={related.id}
              className={styles.relatedItem}
            >
              <img
                src={related.images[0]} 
                alt={related.title}
                className={styles.relatedImage}
              />
            </div>
          ))}
      </div> */}
    </div>
  );
};

export default ImageDetailsPage;
