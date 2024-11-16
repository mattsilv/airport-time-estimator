import { useState, useRef, useEffect, useCallback } from "react";
import { filterAirports, getNearestAirports } from "../utils/airportUtils";
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
  const [error, setError] = useState(null);
  const wrapperRef = useRef(null);
  const listId = "airport-list";

  const loadSuggestions = useCallback(
    async (query = "") => {
      try {
        let results;
        if (!query && userLocation) {
          results = await getNearestAirports(userLocation);
        } else if (query) {
          results = await filterAirports(query);
        } else {
          results = [];
        }
        setSuggestions(results);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading suggestions:", err);
        setError("Failed to load airports");
        setIsLoading(false);
      }
    },
    [userLocation]
  );

  useEffect(() => {
    if (userLocation) {
      loadSuggestions();
    }
  }, [userLocation, loadSuggestions]);

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
      loadSuggestions(inputValue);
    } else if (userLocation) {
      loadSuggestions();
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

  const handleFocus = () => {
    setIsOpen(true);
    if (!userLocation && onRequestLocation) {
      onRequestLocation();
    }
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
        placeholder={
          !userLocation
            ? "Tap to find nearest airports"
            : placeholder || "Search airports..."
        }
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
              {!userLocation
                ? "Requesting location access..."
                : "Loading airports..."}
            </div>
          ) : error ? (
            <div className={`${styles.suggestionItem} ${styles.error}`}>
              {error}
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
