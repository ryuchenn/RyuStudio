import React from "react";
import styles from './index.module.scss';

const Googlemap: React.FC = () => {

    return (
        <>
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093746!2d144.9559283153187!3d-37.81720997975171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf5771d6c0865e47a!2sMelbourne!5e0!3m2!1sen!2sau!4v1614316671244!5m2!1sen!2sau"
                allowFullScreen={true}
                loading="lazy"
                className={styles.iframe}
                aria-label="Google Map"></iframe>
        </>
    );
};

export default Googlemap;
