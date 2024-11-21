import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "../styles/Debug.module.css";

export function DebugInfo({ userLocation, airportData, routeInfo, departAt }) {
  const [showDebug, setShowDebug] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const debug = params.get("debug") === "true";
    setShowDebug(debug);
  }, [location]);

  if (!showDebug) return null;

  return (
    <div className={styles.debugContainer}>
      <h5>Debug Info</h5>
      <pre>
        {JSON.stringify(
          {
            userLocation,
            airportData,
            routeInfo,
            departAt,
          },
          null,
          2
        )}
      </pre>
    </div>
  );
}
