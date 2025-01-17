import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.scss';
import { ProgrammingLanguages, Frontend, Backend, Mobile, Database, Cloud, Others, Instrument, Music, Photography} from '@/content/about'

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
            <img
              src="assets/icons/logo.png"
              alt="Profile"
              className={styles.profileImage}
            />
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
                color="#fde68a"
              />

              <SkillCategory
                title={t("translation:About.Backend")}
                skills={Backend}
                color="#ccee00"
              />

              <SkillCategory
                title={t("translation:About.Mobile")}
                skills={Mobile}
                color="#9cced1"
              />

              <SkillCategory
                title={t("translation:About.Database")}
                skills={Database}
                color="#fc9"
              />

              <SkillCategory
                title={t("translation:About.Cloud")}
                skills={Cloud}
                color="#9ccea9"
              />

              <SkillCategory
                title={t("translation:About.Others")}
                skills={Others}
                color="#9ccef1"
              />

              <SkillCategory
                title={t("translation:About.Instrument")}
                skills={Instrument}
                color="#9ccef1"
              />

              <SkillCategory
                title={t("translation:About.Music")}
                skills={Music}
                color="#9ccef1"
              />

              <SkillCategory
                title={t("translation:About.Photography")}
                skills={Photography}
                color="#9ccef1"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
