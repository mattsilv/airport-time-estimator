import React, { useState } from "react";
import styles from "../styles/FeatureRequests.module.css";

export function FeatureRequests() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={styles.container}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={styles.toggleButton}
      >
        {isExpanded ? "▼" : "▶"} Feature Requests
      </button>

      {isExpanded && (
        <div className={styles.content}>
          <div className={styles.section}>
            <p className={styles.sectionTitle}>Coming Soon:</p>
            <ul>
              <li>Save your settings for next time</li>
              <li>Dark mode for late night flight planning</li>
            </ul>
          </div>

          <div className={styles.section}>
            <p className={styles.sectionTitle}>Not Happening:</p>
            <ul>
              <li>
                Real-time traffic (Google Maps API credits don't grow on trees
                🌳)
              </li>
              <li>Flight tracking (just use FlightAware like everyone else)</li>
              <li>TSA wait times (good luck finding that API)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
