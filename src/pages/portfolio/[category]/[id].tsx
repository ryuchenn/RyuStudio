import { useRouter } from "next/router";
import { detailAllImages } from "@/content/profolioCard";
import styles from "./index.module.scss";
import { useTranslation } from 'react-i18next';
import Image from "next/image";

const ImageDetailsPage = () => {
  const { t } = useTranslation(['translation', 'dynamicContent', 'commonVariables']);
  const router = useRouter();
  // const { category, id } = router.query;
  const { id } = router.query;
  const numericId = typeof id === "string" ? parseInt(id, 10) : NaN;

  // Find detailed image by ID
  const imageSet = detailAllImages.find((img) => img.id === numericId);

  if (!imageSet) {
    return <p>{t("translation:Portfolio.NotFound")}</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{imageSet.title}</h1>

      {/* Images show from top to bottom */}
      <div className={styles.imageList}>
        {imageSet.images.map((src, index) => (
          <Image 
          key={index}
          src={src}
          alt={`${imageSet.title} ${index + 1}`}
          className={styles.imageItem}
          width={500} height={500} priority
          ></Image>
        ))}
      </div>

      <div className={styles.content}>
        {imageSet.content}
      </div>
    </div>
  );
};

export default ImageDetailsPage;
