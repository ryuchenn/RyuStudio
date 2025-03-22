import { useRouter } from "next/router";
import { projects } from "@/content/eventsDetail";
import { useTranslation } from 'react-i18next';
import styles from "./id.module.scss";
import Image from "next/image";

const EventDetailsPage = () => {
  const { t } = useTranslation(['translation', 'dynamicContent', 'commonVariables']); 
  const router = useRouter();
  const { id } = router.query;

  const project = projects.find((proj) => proj.id === parseInt(id as string));

  if (!project) {
    return <p>{t("translation:Event.NotFound")}</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{project.title}</h1>

      <div className={styles.content}>
        {/* Description, image, .... */}
        <Image
          src={project.image}
          alt={project.title}
          className={styles.image}
          width={500} height={500} priority
        ></Image>
        <p className={styles.description}>{project.description}</p>
        <h2 className={styles.subtitle}>{t("translation:Event.Details")}</h2>
        <p className={styles.details}>{project.details}</p>

        {/* Google Form */}
        <div>
          {t(`dynamicContent:EventLink.${id}`) == `EventLink.${id}` ?  "" :
            (
              <div style={{ minHeight: "65vh", padding: "20px", textAlign: "center" }}>
                <h1 style={{ marginBottom: "20px", fontSize: "2rem", fontWeight: "bold" }}>
                  {t("translation:Event.JoinEvent")}
                </h1>
                <iframe
                  src={t(`dynamicContent:EventLink.${id}`)}
                  width="100%"
                  height="700px"
                  title="Google Form"
                  style={{
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  }}
                  allowFullScreen
                ></iframe>
              </div>
            )
          }
        </div>

        {/* Tag 1 */}
        <h2 className={styles.subtitle}>{t("translation:Event.Field")}</h2>
        <div className={styles.tagGroup}>
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className={styles.tag}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Tag 2 */}
        <h2 className={styles.subtitle}>{t("translation:Event.Tags")}</h2>
        <div className={styles.tagGroup}>
          {project.tags.map((tag) => (
            <span
              key={tag}
              className={styles.tag}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
