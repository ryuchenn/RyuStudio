import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import styles from "./index.module.scss";
import { useTranslation } from "react-i18next";
import useViewport from "@/hooks/useViewport";

const ContactForm: React.FC = () => {
  const { t } = useTranslation(['translation', 'dynamicContent', 'commonVariables']);
  const { isMobile } = useViewport();

  const form = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    instagram: "",
    message: "",
  });
  const [status, setStatus] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.current) {
      emailjs
        .sendForm(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "",
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "",
          form.current,
          process.env.NEXT_PUBLIC_EMAILJS_API_KEY || ""
        )
        .then(
          () => {
            setStatus("success");
            setFormData({ name: "", email: "", phone: "", instagram: "", message: "" });
          },
          () => {
            setStatus("error");
          }
        );
    }
  };

  return (
    <form ref={form} onSubmit={handleSubmit} className={styles.form}>
      <div className={`${styles.inputGroup} ${styles.inputGroupLg}`}>
        <div>
          <label className={styles.label} htmlFor="name">
            *{t("translation:Book.Name")}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles.inputField}
            maxLength={20}
            required
          />
        </div>
        <div>
          <label className={styles.label} htmlFor="email">
            *{t("translation:Book.Email")}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="abc@example.com"
            className={styles.inputField}
            maxLength={30}
            required
          />
        </div>
      </div>

      <div className={`${styles.inputGroup} ${styles.inputGroupLg}`}>
        <div>
          <label className={styles.label} htmlFor="phone">
            {t("translation:Book.PhoneNumber")}
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 647-123-4567"
            className={styles.inputField}
            maxLength={20}
          />
        </div>
        <div>
          <label className={styles.label} htmlFor="instagram">
            {t("translation:Book.InstagramAccount")}
          </label>
          <input
            type="text"
            id="instagram"
            name="instagram"
            value={formData.instagram}
            onChange={handleChange}
            className={styles.inputField}
            maxLength={25}
          />
        </div>
      </div>

      {isMobile ? (
        <div className={`${styles.inputGroup} ${styles.inputGroupLg}`}>
          <div>
            <label className={styles.label} htmlFor="message">
              *{t("translation:Book.YourMessage")}
            </label>
            <textarea
              id="message"
              name="message"
              placeholder={t("translation:Book.Comments")}
              rows={4}
              className={styles.textareaField}
              maxLength={250}
              required
            ></textarea>
          </div>
        </div>
      ) : (
        <div>
          <label className={styles.label} htmlFor="message">
            *{t("translation:Book.YourMessage")}
          </label>
          <textarea
            id="message"
            name="message"
            placeholder={t("translation:Book.Comments")}
            rows={4}
            className={styles.textareaField}
            maxLength={250}
            required
          ></textarea>
        </div>
      )}
      
      <button type="submit" className={styles.button}>
        {t("translation:Book.Submit")}
      </button>

      {status === "success" && <p className="text-green-500 mt-4">{t("translation:Book.SendSuccess")}</p>}
      {status === "error" && <p className="text-red-500 mt-4">{t("translation:Book.SendError")}</p>}
    </form>
  );
};

export default ContactForm;
