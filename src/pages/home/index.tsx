import React, { useState, useEffect } from "react";
import ContactForm from "@/components/ContactForm";
import Googlemap from "@/components/Googlemap";
import { images, logos, gallery } from "@/content/home";
import Gallery from "@/components/Gallery";
import { useTranslation } from "react-i18next";
import styles from "./index.module.scss";
import Link from "next/link";
import Image from "next/image";
import useViewport from "@/hooks/useViewport";

const HomePage = () => {
    const { t } = useTranslation(["translation", "dynamicContent", "commonVariables"]);
    const { isMobile } = useViewport();

    // Background image transition effect
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prevImage) => (prevImage + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <div className={styles.hero}>
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`${styles.heroImage} ${index === currentImage ? styles.active : ""}`}
                        style={{ backgroundImage: `url(${image})` }}
                    ></div>
                ))}
                <div className={styles.heroOverlay}>
                    <h1 className={styles.heroText}>{t("translation:Home.Title")}</h1>
                    <h2 className={styles.heroSubtitle}>{t("translation:Home.ShortTitle")}</h2>
                </div>
            </div>

            {/* Brand Logo Scrolling */}
            <section className={styles.logoSection}>
                <div className={styles.marqueeWrapper}>
                    <div className={styles.marquee}>
                        {logos.map((logo, index) => (
                            <Image
                                key={index}
                                src={logo}
                                alt={`Logo ${index + 1}`}
                                className={styles.logo}
                                width={200} height={100} priority
                            />
                        ))}
                        {/* Duplicate images for smooth infinite scrolling */}
                        {logos.map((logo, index) => (
                            <Image
                                key={`dup-${index}`}
                                src={logo}
                                alt={`Logo ${index + 1}`}
                                className={styles.logo}
                                width={200} height={100} priority
                            />
                        ))}
                        
                    </div>
                </div>
            </section>


            {/* Gallery Section */}
            <section>
                <Gallery items={gallery} />
            </section>

            {/* Studio Description */}
            <section className={styles.aboutSection}>
                <h2 className={styles.aboutTitle}>{t("translation:Home.AboutUs")}</h2>
                <p className={styles.aboutText}>{t("translation:Home.StudioDescription")}</p>
            </section>

            {/* Services Section */}
            <section className={styles.servicesSection}>
                <h2 className={styles.serviceTitle}>{t("translation:Home.Services")}</h2>
                <div className={styles.serviceGrid}>
                    {["LiveSound", "Photography", "Coding"].map((service, index) => (
                        <div key={index} className={styles.serviceItem}>
                            <Image src={`/assets/icons/${service}.png`} alt={service} className={styles.serviceImage} width={500} height={500} priority />
                            <h3 className={styles.serviceSubTitle}>{t(`translation:Home.${service}`)}</h3>
                            <p>{t(`translation:Home.${service}Description`)}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.studioSection}>
                <h2 className={styles.studioTitle}>{t("translation:Home.Studio")}</h2>
                <div className={styles.studioContainer}>
                    <div className={styles.studioText}>
                        <h2 className={styles.studioSubtitle}>{t("translation:Home.ShortTitle2")}</h2>
                        <p className={styles.studioDescription}>{t("translation:Home.StudioDescription2")}</p>
                        <Link href="/contact" className={styles.studioButton}>
                            {t("translation:Home.Contact")}
                        </Link>
                    </div>
                    <div className={styles.studioImageWrapper}>
                        <Image
                            src="/assets/icons/studioA.png"
                            alt="Studio A"
                            className={styles.studioImage}
                            width={500} height={500} priority
                        />
                    </div>
                </div>
            </section>

            <section className={`${styles.studioSection} ${styles.studioReverse}`}>
                <div className={styles.studioContainer}>
                    {!isMobile && (
                        <div className={styles.studioImageWrapper}>
                            <Image
                                src="/assets/icons/studioB.png"
                                alt="Studio B"
                                className={styles.studioImage}
                                width={500} height={500} priority
                            />
                        </div>
                    )}
                    <div className={styles.studioText}>
                        <h2 className={styles.studioSubtitle}>{t("translation:Home.ShortTitle3")}</h2>
                        <p className={styles.studioDescription}>{t("translation:Home.StudioDescription3")}</p>
                        <Link href="/studio/musicA" className={styles.studioButton}>
                            {t("translation:Home.Learn")}
                        </Link>
                    </div>
                    {isMobile && (
                        <div className={styles.studioImageWrapper}>
                            <Image
                                src="/assets/icons/studioB.png"
                                alt="Studio B"
                                className={styles.studioImage}
                                width={500} height={500} priority
                            />
                        </div>
                    )}
                </div>
            </section>

            {/* Book Section */}
            <div className={styles.bookSection}>
                <h1 className={styles.bookTitle}>{t("translation:Home.Book")}</h1>
                <p className={styles.bookDescription}>{t("translation:Home.BookDescription")}</p>
                <ContactForm />
            </div>

            {/* Google Map */}
            <div className={styles.mapSection}>
                <div className={styles.mapContainer}>
                    <Googlemap />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
