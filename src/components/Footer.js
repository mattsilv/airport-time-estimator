import React from "react";
import styles from "../styles/Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.text}>
        a silly&nbsp;
        <a
          href="https://github.com/mattsilv/airport-time-estimator"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          open-source
        </a>{" "}
        app by{" "}
        <a
          href="https://silv.blog"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          silv.eth
        </a>
      </p>
    </footer>
  );
}

export default Footer;
