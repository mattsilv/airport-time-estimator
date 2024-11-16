import React from "react";
import styles from "../styles/Debug.module.css";

export const DebugInfo = ({
  userLocation,
  airportData,
  routeInfo,
  departAt,
}) => {
  const [geoPermission, setGeoPermission] = React.useState("checking");

  React.useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => {
          setGeoPermission(result.state);
          result.onchange = () => setGeoPermission(result.state);
        })
        .catch(() => setGeoPermission("error checking"));
    } else {
      setGeoPermission("API not supported");
    }
  }, []);

  // Check for debug flag in URL or development environment
  const isDebugEnabled = React.useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return process.env.NODE_ENV === "development" || urlParams.has("debug");
  }, []);

  if (!isDebugEnabled) return null;

  const formatData = (data) => {
    if (!data) return "null";
    if (typeof data === "object") {
      return JSON.stringify(
        data,
        (key, value) => {
          if (key === "route") return "[Route Object]";
          return value;
        },
        2
      );
    }
    return data.toString();
  };

  const browserInfo = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    vendor: navigator.vendor,
    isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
    isSafari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
  };

  const debugData = {
    device: {
      ...browserInfo,
      geolocationSupported: "geolocation" in navigator,
      geolocationPermission: geoPermission,
      https: window.location.protocol === "https:",
    },
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
