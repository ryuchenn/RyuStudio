import React from 'react';
import { FaFacebookF, FaInstagram, FaTiktok, FaTwitter, FaYoutube } from 'react-icons/fa';
import { SiXiaohongshu } from 'react-icons/si';
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from 'react-i18next';
import styles from './index.module.scss';

const Footer: React.FC = () => {
  const { t } = useTranslation(['translation', 'dynamicContent', 'commonVariables']); 

  return (
    <footer className={styles.footer}>
      <div className="container mx-auto">
        {/* Social Media Icons */}
        <div className={styles.socialMediaIcons}>
          <a href={t("commonVariables:SocialMedia.YoutubeLink")} target="_blank" rel="noopener noreferrer" aria-label="Youtube">
            <FaYoutube className={styles.socialIcon} />
          </a>
          <a href={t("commonVariables:SocialMedia.InstagramLink")} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram className={styles.socialIcon} />
          </a>
          <a href={t("commonVariables:SocialMedia.FacebookLink")} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaFacebookF className={styles.socialIcon} />
          </a>
          <a href={t("commonVariables:SocialMedia.TiktokLink")} target="_blank" rel="noopener noreferrer" aria-label="Tiktok">
            <FaTiktok className={styles.socialIcon} />
          </a>
          <a href={t("commonVariables:SocialMedia.TwitterLink")} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <FaTwitter className={styles.socialIcon} />
          </a>
          <a href={t("commonVariables:SocialMedia.XiaohongshuLink")} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <SiXiaohongshu className={styles.socialIcon} />
          </a>
        </div>

        {/* Contact Info */}
        <div className={styles.contactInfo}>
          <p>Tel: {t("commonVariables:Information.Tel")}</p>
          <p>{t("commonVariables:Information.Mail")}</p>
          <p>{t("commonVariables:Information.Address")}</p>
          <p>
            &copy; {new Date().getFullYear()} - All Right Reserved. Designed and Developed by {t("commonVariables:Information.StudioName")}
          </p>
        </div>
      </div>

      {/* Language Switcher */}
      <div className={styles.languageSwitcher}>
        <LanguageSwitcher />
      </div>
    </footer>
  );
};

export default Footer;
