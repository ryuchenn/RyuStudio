import React, { useState, useEffect } from "react";
import ContactForm from "@/components/ContactForm";
import Googlemap from "@/components/Googlemap";
import { images, logos, gallery } from "@/content/home";
import Gallery from "@/components/Gallery";
import { useTranslation } from 'react-i18next';
import styles from "./index.module.scss";
import Link from "next/link";
import Image from "next/image";

const HomePage = () => {
    const { t } = useTranslation(['translation', 'dynamicContent', 'commonVariables']); 

    // The background image status
    const [currentImage, setCurrentImage] = useState(0);

    // Change image effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prevImage) => (prevImage + 1) % images.length);
        }, 4000); // change image per 4 second
        return () => clearInterval(interval); 
    }, );

    return (
        <div className="min-h-screen bg-white text-black">
            {/* Background image container */}
            <div className="relative w-full h-[70vh] overflow-hidden">
                {/* Image change effect */}
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImage ? "opacity-100" : "opacity-0"
                            }`}
                        style={{
                            backgroundImage: `url(${image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    ></div>
                ))}
                <div className="absolute inset-0 bg-black bg-opacity-15 flex items-center justify-center">
                    <div className="text-center text-white">
                        <h1 className="text-6xl font-bold">{t("translation:Home.Title")}</h1>
                        <p className="text-2xl mt-4">{t("translation:Home.ShortTitle")}</p>
                    </div>
                </div>
            </div>

            {/* Brand Logo scrolling */}
            <section className="py-8 bg-gray-100">
                <div className="overflow-hidden relative">
                    <div className="flex justify-center items-center animate-marquee space-x-8">
                        {logos.map((logo, index) => (
                            <Image
                                key={index} 
                                src={logo} 
                                alt={`Logo ${index + 1}`} 
                                className="h-16 w-auto"
                                width={500} height={500} priority
                            ></Image>
                        ))}
                        {/* {logos.map((logo, index) => (
                            <img key={index + logos.length} src={logo} alt={`Logo ${index + 1}`} className="h-16 w-auto" />
                        ))} */}
                    </div>
                </div>
            </section>

            {/* Gallery */}
            <section>
                {/* <h2 className="text-4xl font-bold mb-8 text-center">{t("translation:Home.GalleryTitle")}</h2> */}
                <Gallery items={gallery} /> 
            </section>

            {/* Studio Detailed Description */}
            <section className="py-16">
                <h2 className="text-4xl font-bold mb-8 text-center">{t("translation:Home.AboutUs")}</h2>
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-xl">
                        {t("translation:Home.StudioDescription")}
                    </p>
                </div>
            </section>

            {/* Service Field */}
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-12 text-black">{t("translation:Home.Services")}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center text-black">
                            <Image
                                src="data:image/jpeg;base64,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"
                                alt="Live Sound"
                                className="w-full h-64 object-cover rounded-lg shadow-lg mb-6"
                                width={500} height={500} priority
                            ></Image>
                            <h3 className="text-2xl font-bold mb-4">{t("translation:Home.LiveSound")}</h3>
                            <p className="text-gray-700">{t("translation:Home.LiveSoundDescription")}</p>
                        </div>
                        <div className="flex flex-col items-center text-black">
                            <Image
                                src="data:image/jpeg;base64,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"
                                alt="Photography"
                                className="w-full h-64 object-cover rounded-lg shadow-lg mb-6"
                                width={500} height={500} priority
                            >
                            </Image>
                            <h3 className="text-2xl font-bold mb-4">{t("translation:Home.Photography")}</h3>
                            <p className="text-gray-700">{t("translation:Home.PhotographyDescription")}</p>
                        </div>
                        <div className="flex flex-col items-center text-black">
                            <Image
                                src="https://static.vecteezy.com/system/resources/previews/001/831/032/non_2x/web-design-studio-unique-design-kit-for-social-networks-stories-vector.jpg"
                                alt="Live Sound"
                                className="w-full h-64 object-cover rounded-lg shadow-lg mb-6"
                                width={500} height={500} priority
                            >
                            </Image>
                            <h3 className="text-2xl font-bold mb-4">{t("translation:Home.Coding")}</h3>
                            <p className="text-gray-700">{t("translation:Home.CodingDescription")}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Left: Text, Right: Picture */}
            <section className="py-16">
                <h2 className="text-4xl font-bold mb-8 text-center">{t("translation:Home.Studio")}</h2>
                <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center space-y-8  md:space-y-0 md:space-x-8">
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-3xl font-bold mt-4 mb-4">{t("translation:Home.ShortTitle2")}</h2>
                        <p className="text-lg">
                            {t("translation:Home.StudioDescription2")}
                        </p>
                        <button className="mt-4 px-6 py-2 bg-black text-white rounded-md">
                            <Link href="/contact">{t("translation:Home.Contact")}</Link>
                        </button>
                    </div>
                    <div className="flex-1">
                        <Image
                            src="https://img.peerspace.com/image/upload/ar_1.5,c_fill,g_auto,f_auto,q_auto,dpr_auto,w_3840/hjsz1yeq81xl97duzb4u"
                            alt="Studio A"
                            className="rounded-md shadow-lg"
                            width={500} height={500} priority
                        >
                        </Image>
                    </div>
                </div>
            </section>

            {/* Left: Picture, Right: Text */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row-reverse items-center md:gap-16 space-y-8 md:space-y-0">
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-3xl font-bold mt-4 mb-4">{t("translation:Home.ShortTitle3")}</h2>
                        <p className="text-lg">
                            {t("translation:Home.StudioDescription3")}
                        </p>
                        <button className="mt-4 px-6 py-2 bg-black text-white rounded-md">
                            <Link href="/studio/musicA">{t("translation:Home.Learn")}</Link>
                        </button>
                    </div>
                    <div className="flex-1">
                        <Image
                            src="https://images.squarespace-cdn.com/content/v1/65ba55d8e05e3f0491458d90/7ac341d1-1993-46dd-aba8-769fb9ee7325/Monarch-144-2-alt.jpg"
                            alt="Studio B"
                            className="rounded-md shadow-lg"
                            width={500} height={500} priority
                        ></Image>
                    </div>
                </div>
            </section>

            {/* Book Section */}
            <div className="bg-white text-black flex flex-col items-center py-10 px-4">
                <div className="max-w-5xl w-full space-y-12">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold mb-4">{t("translation:Home.Book")}</h1>
                        <p className="text-lg mb-4">
                            {t("translation:Home.BookDescription")}
                        </p>

                    </div>
                </div>
            </div>

            {/* Google Form - Style 1 */}
            <div className={styles.contactSection}>
                <div className={styles.contactContainer}>
                    <ContactForm />
                    <Googlemap />
                </div>
            </div>

            {/* Google Form - Style 2 */}
            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Googlemap ></Googlemap>
                <div className="space-y-6">
                    <ContactForm></ContactForm>
                </div>
            </div> */}
        </div>
    );
};

export default HomePage;
