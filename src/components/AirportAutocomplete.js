import { useState, useRef, useEffect } from "react";
import ReactGA from "react-ga4";
import {
  filterAirports,
  getNearestAirports,
  preloadAirports,
} from "../utils/airportUtils";
import { calculateRoute } from "../services/tomtom";
import styles from "../styles/Form.module.css";

export const AirportAutocomplete = ({
  value,
  onChange,
  placeholder,
  onAirportSelect,
  boardingTime,
  selectedDate,
  userLocation,
  onRequestLocation,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef(null);
  const listId = "airport-list";

  // Preload airports once on mount - no dependencies needed
  useEffect(() => {
    const loadInitialData = async () => {
      await preloadAirports();
    };
    loadInitialData();
  }, []); // Empty dependency array is fine here as we only want to preload once

  // Handle user location and nearest airports
  useEffect(() => {
    if (!userLocation) return;

    const loadNearestAirports = async () => {
      setIsLoading(true);
      try {
        const airports = await getNearestAirports(userLocation);
        setSuggestions(airports);
      } finally {
        setIsLoading(false);
      }
    };
    loadNearestAirports();
  }, [userLocation]); // This effect handles all userLocation changes

  const handleFocus = () => {
    setIsOpen(true);
    if (!userLocation && onRequestLocation) {
      setIsLoading(true);
      onRequestLocation();
    }
  };

  const handleInputChange = async (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    setIsLoading(true);

    try {
      if (inputValue.trim()) {
        const results = await filterAirports(inputValue);
        setSuggestions(results);
      } else if (userLocation) {
        const airports = await getNearestAirports(userLocation);
        setSuggestions(airports);
      } else {
        setSuggestions([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAirportSelection = async (airport) => {
    try {
      ReactGA.event({
        category: "Airport Selection",
        action: "Select Airport",
        label: airport.code,
        airport_code: airport.code,
        airport_name: airport.display,
      });
    } catch (error) {
      console.debug("GA tracking error:", error);
    }

    if (userLocation) {
      try {
        setIsLoading(true);
        const routeInfo = await calculateRoute(userLocation, {
          lat: airport.lat,
          long: airport.long,
        });

        if (routeInfo) {
          routeInfo.travelTimeMinutes = routeInfo.travelTimeMinutes + 5;
        }

        onAirportSelect({
          airport: {
            code: airport.code,
            display: airport.display,
            lat: airport.lat,
            long: airport.long,
          },
          routeInfo: routeInfo
            ? {
                distance: routeInfo.distance,
                duration: routeInfo.duration,
                travelTimeMinutes: routeInfo.travelTimeMinutes,
              }
            : null,
          userLocation: userLocation,
        });
      } catch (error) {
        console.error("Error calculating route:", error);
        onAirportSelect({
          airport: {
            code: airport.code,
            display: airport.display,
            lat: airport.lat,
            long: airport.long,
          },
          userLocation: userLocation,
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      onAirportSelect({
        airport: {
          code: airport.code,
          display: airport.display,
          lat: airport.lat,
          long: airport.long,
        },
      });
    }
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className={styles.autocompleteWrapper}>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onClick={() => {
          setIsOpen(true);
          if (!userLocation && onRequestLocation) {
            onRequestLocation();
          }
        }}
        placeholder="Airport Code"
        className={styles.formControl}
        role="combobox"
        aria-controls={listId}
        aria-expanded={isOpen}
        aria-autocomplete="list"
      />
      {isOpen && (
        <div id={listId} className={styles.suggestionsList} role="listbox">
          {isLoading ? (
            <div className={`${styles.suggestionItem} ${styles.loading}`}>
              Loading airports...
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((airport) => (
              <div
                key={airport.code}
                role="option"
                aria-selected={false}
                onClick={() => {
                  onChange(airport.code);
                  handleAirportSelection(airport);
                }}
                className={styles.suggestionItem}
              >
                {airport.display}
              </div>
            ))
          ) : value.trim() ? (
            <div className={styles.suggestionItem}>No airports found</div>
          ) : null}
        </div>
      )}
    </div>
  );
};
