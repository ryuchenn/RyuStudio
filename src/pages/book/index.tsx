import React from "react";
import { useTranslation } from "react-i18next";
import styles from './index.module.scss';
import ContactForm from "@/components/ContactForm";
import Googlemap from "@/components/Googlemap";

const Book: React.FC = () => {
  const { t } = useTranslation(['translation', 'dynamicContent', 'commonVariables']); 

  return (
    <>
      <div className={styles.container}>
        <div className={styles.section}>
          <div className={styles.header}>
            <h1 className={styles.title}>{t("translation:Book.Title")}</h1>
            <p className={styles.description}>{t("translation:Book.Description")}</p>
          </div>

          <div className={`${styles.grid} ${styles.gridLg}`}>
            <img src="/assets/test/BookA.png" alt="Studio location" className={styles.img} />
            <Googlemap></Googlemap>
          </div>
        </div>
        <ContactForm></ContactForm>
      </div>
    </>
  );
};

export default Book;
