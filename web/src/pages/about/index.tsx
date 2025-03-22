import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.scss';
import { ProgrammingLanguages, Frontend, Backend, Mobile, Database, Cloud, Others, Instrument, Music, Photography} from '@/content/about'
import Image from 'next/image';

interface SkillCategoryProps {
  title: string;
  skills: string[];
  color?: string;
}

const SkillCategory: React.FC<SkillCategoryProps> = ({ title, skills, color }) => {
  return (
    <div>
      <h4 className={styles.skillCategoryTitle}>{title}</h4>
      <div className={styles.skillList}>
        {skills.map((skill, index) => (
          <span
            key={index}
            className={styles.skillItem}
            style={{ backgroundColor: color }}>
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

const About: React.FC = () => {
  const { t } = useTranslation(['translation', 'dynamicContent', 'commonVariables']); 

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>

          {/* Header Section */}
          <div className={styles.header}>
            <Image
              src="assets/icons/logo.png"
              alt="Profile"
              className={styles.profileImage}
              width={500} height={500} priority
            ></Image>
            <div>
              <h1 className={styles.name}>{t("translation:About.Name")}</h1>
              <h2 className={styles.profession}>
                {t("translation:About.Profession")}
              </h2>
              <p className={styles.description}>
                {t("translation:About.Description")}
              </p>
            </div>
          </div>

          {/* Skills Section */}
          <div>
            <h3 className={styles.skillsTitle}>{t("translation:About.Skills")}</h3>
            <div className={styles.skillCategories}>
              <SkillCategory
                title={t("translation:About.ProgrammingLanguages")}
                skills={ProgrammingLanguages}
                color="#cce7ff"
              />

              <SkillCategory
                title={t("translation:About.Frontend")}
                skills={Frontend}
                color="#ffe8cc"
              />

              <SkillCategory
                title={t("translation:About.Backend")}
                skills={Backend}
                color="#d1f7f5"
              />

              <SkillCategory
                title={t("translation:About.Mobile")}
                skills={Mobile}
                color="#c4f1ff"
              />

              <SkillCategory
                title={t("translation:About.Database")}
                skills={Database}
                color="#d5ffe4"
              />

              <SkillCategory
                title={t("translation:About.Cloud")}
                skills={Cloud}
                color="#a8e6ff"
              />

              <SkillCategory
                title={t("translation:About.Others")}
                skills={Others}
                color="#f8e8a6"
              />

              <SkillCategory
                title={t("translation:About.Instrument")}
                skills={Instrument}
                color="#e6ddff"
              />

              <SkillCategory
                title={t("translation:About.Music")}
                skills={Music}
                color="#b0f2c2"
              />

              <SkillCategory
                title={t("translation:About.Photography")}
                skills={Photography}
                color="#ffd9e8"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
