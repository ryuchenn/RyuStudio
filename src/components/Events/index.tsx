import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { projects, techStacks, tags } from "@/content/events";
import styles from "./index.module.scss";
import { useTranslation } from 'react-i18next';

const EventPageEmbed = () => {
  const { t } = useTranslation(['translation', 'dynamicContent', 'commonVariables']); 
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [selectedTechStacks, setSelectedTechStacks] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("Newest");
  const [showFilters, setShowFilters] = useState(false);

  const toggleTechStack = (tech: string) => {
    

    setSelectedTechStacks((prev) =>
      prev.includes(tech) ? prev.filter((item) => item !== tech) : [...prev, tech]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const filteredProjects = projects
    .filter((project) => {
      const matchesSearch =
        searchText === "" || project.title.toLowerCase().includes(searchText.toLowerCase());
      const matchesTechStack =
        selectedTechStacks.length === 0 ||
        selectedTechStacks.every((tech) => project.techStack.includes(tech));
      const matchesTags =
        selectedTags.length === 0 || selectedTags.every((tag) => project.tags.includes(tag));
      return matchesSearch && matchesTechStack && matchesTags;
    })
    .sort((a, b) => {
      if (sortOption === "Newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortOption === "Oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      return 0;
    });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("translation:Event.Title")}</h1>

      {/* Search, Filter, Sort */}
      <div className={styles.controls}>
        <input
          type="text"
          placeholder={t("translation:Event.Search")}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className={styles.search}
        />

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className={styles.select}
        >
          <option value="Newest">{t("translation:Event.Newest")}</option>
          <option value="Oldest">{t("translation:Event.Oldest")}</option>
        </select>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={styles.filterButton}
        >
          {showFilters ? t("translation:Event.HideFilters") : t("translation:Event.Filter")}
        </button>
      </div>

      {/* Filter Button */}
      {showFilters && (
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <h2 className={styles.filterTitle}>{t("translation:Event.Field")}</h2>
            <div className={styles.filterItems}>
              {techStacks.map((tech) => (
                <button
                  key={tech}
                  onClick={() => toggleTechStack(tech)}
                  className={`${styles.filterItem} ${selectedTechStacks.includes(tech) ? styles.filterItemSelected : ""
                    }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <h2 className={styles.filterTitle}>{t("translation:Event.Tags")}</h2>
            <div className={styles.filterItems}>
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`${styles.filterItem} ${selectedTags.includes(tag) ? styles.filterItemSelected : ""
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Events gallery */}
      <div className={styles.projects}>
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className={styles.projectCard}
            onClick={() => router.push(`/event/${project.id}`)}
          >
            <Image
              src={project.image}
              alt={project.title}
              className={styles.projectImage}
              width={500}
              height={500} 
              priority
            />
            <h3 className={styles.projectTitle}>{project.title}</h3>
            <p className={styles.projectDate}>{t("translation:Event.Date")}: {project.date}</p>
            <div className={styles.projectTechStack}>
              {project.techStack.map((tech) => (
                <span key={tech} className={styles.projectTech}>
                  {tech}
                </span>
              ))}
            </div>
            <p className={styles.projectDescription}>{project.description}</p>
            <div className={styles.projectTags}>
              {project.tags.map((tag) => (
                <span key={tag} className={styles.projectTag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default EventPageEmbed;
