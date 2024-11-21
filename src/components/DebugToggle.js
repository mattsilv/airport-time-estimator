import React, { useEffect, useState } from "react";
import styles from "../styles/Debug.module.css";

export const DebugToggle = ({ onToggle }) => {
  const [isDebugEnabled, setIsDebugEnabled] = useState(() => {
    return localStorage.getItem("debugMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("debugMode", isDebugEnabled);
    onToggle(isDebugEnabled);
  }, [isDebugEnabled, onToggle]);

  return (
    <div className={styles.debugToggleContainer}>
      <label className={styles.debugToggleLabel}>
        <span>Debug Mode</span>
        <input
          type="checkbox"
          checked={isDebugEnabled}
          onChange={(e) => setIsDebugEnabled(e.target.checked)}
          className={styles.debugToggleInput}
        />
        <span className={styles.debugToggleSlider}></span>
      </label>
    </div>
  );
};
