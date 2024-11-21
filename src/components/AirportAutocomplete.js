import { useState, useRef, useEffect } from "react";
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

  // Preload airports data when component mounts
  useEffect(() => {
    preloadAirports();
  }, []);

  // Start loading nearest airports as soon as we get location
  useEffect(() => {
    if (userLocation) {
      getNearestAirports(userLocation).then((airports) => {
        setSuggestions(airports);
        setIsLoading(false);
      });
    }
  }, [userLocation]);

  const handleFocus = () => {
    setIsOpen(true);
    if (!userLocation && onRequestLocation) {
      setIsLoading(true); // Show loading state immediately
      onRequestLocation();
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = async (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    if (inputValue.trim()) {
      filterAirports(inputValue).then((results) => {
        setSuggestions(results);
        setIsLoading(false);
      });
    } else if (userLocation) {
      getNearestAirports(userLocation).then((airports) => {
        setSuggestions(airports);
        setIsLoading(false);
      });
    } else {
      setSuggestions([]);
    }
  };

  const handleAirportSelection = async (airport) => {
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
          airport,
          routeInfo,
          userLocation,
        });
      } catch (error) {
        console.error("Error calculating route:", error);
        onAirportSelect({ airport }); // Still send airport even if route calc fails
      } finally {
        setIsLoading(false);
      }
    } else {
      onAirportSelect({ airport });
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
