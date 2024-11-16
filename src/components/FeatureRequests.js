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
              <li>View detailed time calculation breakdown</li>
              <li className={styles.completed}>
                <s>Dark mode for late night flight planning</s> ✓
              </li>
              <li className={styles.completed}>
                <s>Real-time traffic using TomTom API</s> ✓
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <p className={styles.sectionTitle}>Not Happening:</p>
            <ul>
              <li>Flight tracking (just use FlightAware like everyone else)</li>
              <li>TSA wait times (good luck finding that API)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
