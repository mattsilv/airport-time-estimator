import React from "react";
import styles from "../styles/Debug.module.css";

export const DebugInfo = ({
  userLocation,
  airportData,
  routeInfo,
  departAt,
}) => {
  if (process.env.NODE_ENV !== "development") return null;

  const formatData = (data) => {
    if (!data) return "null";
    if (typeof data === "object") {
      // Remove circular references and format nicely
      return JSON.stringify(
        data,
        (key, value) => {
          if (key === "route") return "[Route Object]"; // Simplify route object
          return value;
        },
        2
      );
    }
    return data.toString();
  };

  const debugData = {
    userLocation: userLocation
      ? {
          lat: userLocation.lat.toFixed(6),
          long: userLocation.long.toFixed(6),
        }
      : null,
    airport: airportData
      ? {
          code: airportData.code,
          name: airportData.display,
          location: {
            lat: airportData.lat,
            long: airportData.long,
          },
        }
      : null,
    route: routeInfo
      ? {
          travelTime: `${routeInfo.travelTimeMinutes} minutes`,
          distance: `${routeInfo.distanceKm} km`,
        }
      : null,
    departAt: departAt ? new Date(departAt).toLocaleString() : null,
  };

  return (
    <div className={styles.debugContainer}>
      <div className={styles.debugContent}>
        <h6>Debug Info</h6>
        <pre>
          {Object.entries(debugData).map(([key, value]) => (
            <div key={key} className={styles.debugItem}>
              <strong>{key}:</strong> {formatData(value)}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
};
