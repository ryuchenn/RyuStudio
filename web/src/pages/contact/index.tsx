import React from 'react';
import { FaYoutube, FaInstagram, FaTiktok, FaTwitter, FaEnvelope, FaFacebookF } from 'react-icons/fa';
import { SiXiaohongshu } from "react-icons/si";
import styles from "./index.module.scss"
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

const Contact: React.FC = () => {
  const { t } = useTranslation(['translation', 'dynamicContent', 'commonVariables']); 

  return (
    <div className={styles.contactContainer}>

      {/* Header */}
      <div className={styles.contactHeader}>
        <Image
          src="/assets/icons/logo.png"
          alt="Profile"
          className={styles.contactLogo}
          width={500} height={500} priority
        ></Image>
        <h1 className={styles.contactTitle}>{t("commonVariables:Information.StudioName")}</h1>
        <p className={styles.contactDescription}>{t("translation:Contact.Profession")}</p>
      </div>

      {/* Social Media */}
      <div className={styles.contactSocialIcons}>
        <a href={t("commonVariables:SocialMedia.YoutubeLink")} className={styles.socialIcon}>
          <FaYoutube className={styles.socialIcon} />
        </a>
        <a href={t("commonVariables:SocialMedia.InstagramLink")} className={styles.socialIcon}>
          <FaInstagram className={styles.socialIcon} />
        </a>
        <a href={t("commonVariables:SocialMedia.FacebookLink")} className={styles.socialIcon}>
          <FaFacebookF className={styles.socialIcon} />
        </a>
        <a href={t("commonVariables:SocialMedia.TiktokLink")} className={styles.socialIcon}>
          <FaTiktok className={styles.socialIcon} />
        </a>
        <a href={t("commonVariables:SocialMedia.TwitterLink")} className={styles.socialIcon}>
          <FaTwitter className={styles.socialIcon} />
        </a>
        <a href={t("commonVariables:SocialMedia.XiaohongshuLink")} className={styles.socialIcon}>
          <SiXiaohongshu className={styles.socialIcon} />
        </a>
      </div>

      {/* Contact Links */}
      <div className={styles.contactLinks}>
        <a href="#" className={styles.contactLink}>
          <div className={styles.linkContent}>
            <FaEnvelope className={styles.icon} />
            <div>
              <p className={styles.linkTitle}>Mail</p>
              <p className={styles.linkDescription}>{t("commonVariables:Information.Mail")}</p>
            </div>
          </div>
        </a>

        <a href={t("commonVariables:SocialMedia.YoutubeLink")} className={styles.contactLink}>
          <div className={styles.linkContent}>
            <FaYoutube className={styles.icon} />
            <div>
              <p className={styles.linkTitle}>✨ Youtube</p>
              <p className={styles.linkDescription}>{t("commonVariables:SocialMedia.YoutubeAccount")}</p>
            </div>
          </div>
        </a>

        <a href={t("commonVariables:SocialMedia.InstagramLink")} className={styles.contactLink}>
          <div className={styles.linkContent}>
            <FaInstagram className={styles.icon} />
            <div>
              <p className={styles.linkTitle}>📸 Instagram</p>
              <p className={styles.linkDescription}>{t("commonVariables:SocialMedia.InstagramAccount")}</p>
            </div>
          </div>
        </a>

        <a href={t("commonVariables:SocialMedia.FacebookLink")} className={styles.contactLink}>
          <div className={styles.linkContent}>
            <FaFacebookF className={styles.icon} />
            <div>
              <p className={styles.linkTitle}>📚 Facebook</p>
              <p className={styles.linkDescription}>{t("commonVariables:SocialMedia.FacebookAccount")}</p>
            </div>
          </div>
        </a>

        <a href={t("commonVariables:SocialMedia.TiktokLink")} className={styles.contactLink}>
          <div className={styles.linkContent}>
            <FaTiktok className={styles.icon} />
            <div>
              <p className={styles.linkTitle}>🎵 TikTok</p>
              <p className={styles.linkDescription}>{t("commonVariables:SocialMedia.TiktokAccount")}</p>
            </div>
          </div>
        </a>

        <a href={t("commonVariables:SocialMedia.TwitterLink")} className={styles.contactLink}>
          <div className={styles.linkContent}>
            <FaTwitter className={styles.icon} />
            <div>
              <p className={styles.linkTitle}>🌏 Twitter</p>
              <p className={styles.linkDescription}>{t("commonVariables:SocialMedia.TwitterAccount")}</p>
            </div>
          </div>
        </a>

        <a href={t("commonVariables:SocialMedia.XiaohongshuLink")} className={styles.contactLink}>
          <div className={styles.linkContent}>
            <SiXiaohongshu className={styles.icon} />
            <div>
              <p className={styles.linkTitle}>📕 {t("translation:Contact.Xiaohongshu")}</p>
              <p className={styles.linkDescription}>{t("commonVariables:SocialMedia.TwitterAccount")}</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Contact;
