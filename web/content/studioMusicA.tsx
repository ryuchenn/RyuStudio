import Image from "next/image";
import styles from "../src/pages/studio/css/musicA.module.scss";
import { TFunction } from "i18next";

export const images = [
    "https://images.squarespace-cdn.com/content/v1/663122cb62cc0b3cd0ae2f38/7dff52ec-822c-4277-a85a-e70decedda65/revolution_recording_studio_control_room-side-view.jpg?format=2500w",
    "https://images.squarespace-cdn.com/content/v1/663122cb62cc0b3cd0ae2f38/575a85b4-2b85-4d9f-a9c7-c9b6e33d44a3/revolution_recording_studio_a_music_stands.jpg?format=2500w",
    "https://images.squarespace-cdn.com/content/v1/663122cb62cc0b3cd0ae2f38/d9e4e35b-b223-449d-904b-55def1c71de3/revolution_recording_studio_a_control_room.jpg?format=2500w",
];

export const tabContent = (t: TFunction) => ({
  Overview: (
    <div className={styles.tabContentContainer}>
      <p className={styles.tabDescription}>
        Welcome to our professional music studio! Our space is designed for musicians, producers, and creators looking for high-quality sound recording and production facilities.
      </p>
      <ul className={styles.tabList}>
        <li>State-of-the-art equipment</li>
        <li>Soundproof recording rooms</li>
        <li>Professional mixing and mastering services</li>
      </ul>
    </div>
  ),
  Equipment: (
    <div className={styles.tabContentContainer}>
      <p className={styles.tabDescription}>
        Our studio is equipped with industry-leading tools and software to bring your music to life.
      </p>
      <ul className={styles.tabList}>
        <li>Audio Interface: Focusrite Scarlett 18i20</li>
        <li>Studio Monitors: Yamaha HS8</li>
        <li>MIDI Controllers: Akai MPK249</li>
        <li>Software: Ableton Live, Logic Pro, FL Studio</li>
      </ul>
    </div>
  ),
  Microphones: (
    <div className={styles.tabContentContainer}>
      <p className={styles.tabDescription}>
        We provide a range of microphones for different recording needs, from vocals to instruments.
      </p>
      <ul className={styles.tabList}>
        <li>Shure SM7B – Ideal for podcasting & vocals</li>
        <li>Neumann U87 – High-end condenser microphone</li>
        <li>RØDE NT1-A – Low-noise condenser mic</li>
        <li>AKG C414 – Versatile large-diaphragm condenser mic</li>
      </ul>
    </div>
  ),
  "Floor Plans": (
    <div className={styles.tabContentContainer}>
      <p className={styles.tabDescription}>
        Check out our studio layout for optimal recording and production workflow.
      </p>
      <div className={styles.imageWrapper}>
        <Image
          src="/assets/test/FloorPlanA.png"
          alt="Studio A"
          className={styles.studioImage}
          width={800} height={800} priority
        />
      </div>
    </div>
  ),
  Instruments: (
    <div className={styles.tabContentContainer}>
      <p className={styles.tabDescription}>
        We offer a variety of instruments available for use in our studio.
      </p>
      <ul className={styles.tabList}>
        <li>Electric Guitars: Fender Stratocaster, Gibson Les Paul</li>
        <li>Bass Guitars: Fender Jazz Bass, Music Man StingRay</li>
        <li>Keyboards: Nord Stage 3, Yamaha Motif XF</li>
        <li>Drums: DW Collector's Series Acoustic Drum Kit</li>
      </ul>
    </div>
  ),
  Price: (
    <div className={styles.tabContentContainer}>
      <p className={styles.tabDescription}>
        We offer competitive pricing based on your recording and production needs.
      </p>
      <table className={styles.priceTable}>
        <thead>
          <tr>
            <th>Service</th>
            <th>Hourly Rate</th>
            <th>Daily Rate</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Studio Rental</td>
            <td>$50/hr</td>
            <td>$400/day</td>
          </tr>
          <tr>
            <td>Mixing & Mastering</td>
            <td>$80/hr</td>
            <td>$600/project</td>
          </tr>
          <tr>
            <td>Session Musician</td>
            <td>$100/hr</td>
            <td>-</td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
});
