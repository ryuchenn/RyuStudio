import { useState } from "react";
import { projects, techStacks, tags } from "@/content/project";
import styles from "./index.module.scss";
import { useTranslation } from 'react-i18next';

const ProjectsForm = () => {
  const { t } = useTranslation(['translation', 'dynamicContent', 'commonVariables']); 
  const [searchText, setSearchText] = useState("");
  const [selectedTechStacks, setSelectedTechStacks] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

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

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      searchText === "" || project.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesTechStack =
      selectedTechStacks.length === 0 ||
      selectedTechStacks.every((tech) => project.techStack.includes(tech));
    const matchesTags =
      selectedTags.length === 0 || selectedTags.every((tag) => project.tags.includes(tag));
    return matchesSearch && matchesTechStack && matchesTags;
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t("translation:Project.Title")}</h1>
      </div>

      {/* Search, Filter button */}
      <div className={styles.controls}>
        <input
          type="text"
          placeholder={t("translation:Project.Search")}
          value={searchText}
          onChange={handleSearch}
          className={styles.searchInput}
        />

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={styles.filterButton}
        >
          {showFilters ? t("translation:Project.HideFilters") : t("translation:Project.Filter")}
        </button>
      </div>

      {/* Filter tag button */}
      {showFilters && (
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <h2 className={styles.filterTitle}>{t("translation:Project.TechStack")}</h2>
            <div className={styles.filterOptions}>
              {techStacks.map((tech) => (
                <button
                  key={tech}
                  onClick={() => toggleTechStack(tech)}
                  className={`${styles.filterOption} ${
                    selectedTechStacks.includes(tech) ? styles.selected : ""
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <h2 className={styles.filterTitle}>{t("translation:Project.Tags")}</h2>
            <div className={styles.filterOptions}>
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`${styles.filterOption} ${
                    selectedTags.includes(tag) ? styles.selected : ""
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Project list */}
      <div className={styles.projectsGrid}>
        {filteredProjects.map((project) => (
          <div key={project.id} className={styles.projectCard}>
            <img
              src={project.image}
              alt={project.title}
              className={styles.projectImage}
            />
            <h3 className={styles.projectTitle}>{project.title}</h3>
            <div className={styles.projectTechStack}>
              {project.techStack.map((tech) => (
                <span key={tech} className={styles.projectTech}>
                  {tech}
                </span>
              ))}
            </div>
            <p>{project.description}</p>
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

export default ProjectsForm;
