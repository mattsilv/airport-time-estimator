import React, { useState, useEffect } from "react";
import styles from "../styles/HomeScreenPrompt.module.css";
import { ShareIcon } from "../assets/icons/ShareIcon";

export const HomeScreenPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed or previously dismissed
    const isInstalled = window.matchMedia("(display-mode: standalone)").matches;
    const isDismissed = localStorage.getItem("homeScreenPromptDismissed");

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Show prompt after 15 seconds if not installed and not dismissed
    if (!isInstalled && !isDismissed) {
      const showTimer = setTimeout(() => setShowPrompt(true), 15000);

      // Auto-hide after 15 seconds of being shown
      const hideTimer = setTimeout(() => {
        setShowPrompt(false);
        localStorage.setItem("homeScreenPromptDismissed", "true");
      }, 30000); // 15s delay + 15s show time

      // Cleanup timers
      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("homeScreenPromptDismissed", "true");
  };

  if (!showPrompt) return null;

  return (
    <div className={styles.promptContainer}>
      <div className={styles.promptContent}>
        <span className={styles.promptText}>
          {isIOS ? (
            <>
              Install this app: tap{" "}
              <span className={styles.icon}>
                <ShareIcon />
              </span>{" "}
              then "Add to Home Screen"
            </>
          ) : (
            "Install this app to your home screen"
          )}
        </span>
        <button className={styles.dismissButton} onClick={handleDismiss}>
          ✕
        </button>
      </div>
    </div>
  );
};
