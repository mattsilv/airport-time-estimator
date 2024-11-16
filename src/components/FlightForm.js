import React, { useState, useCallback } from "react";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../styles/Form.module.css";
import sliderStyles from "../styles/Slider.module.css";
import { getAnxietyText, getEmoji } from "../config/anxietyConfig";
import { FlightCheckboxes } from "./FlightCheckboxes";
import { InfoTooltip } from "./InfoTooltip";
import { AirportAutocomplete } from "./AirportAutocomplete";
import { DebugInfo } from "./DebugInfo";

// console.log("All env vars:", process.env);
// console.log("TOMTOM API KEY:", process.env.REACT_APP_TOMTOM_API_KEY);

export const FlightForm = ({
  formValues,
  selectedDate,
  onFieldChange,
  onDateChange,
  onAnxietyChange,
  onCheckboxChange,
}) => {
  const [debugData, setDebugData] = useState({
    userLocation: null,
    airportData: null,
    routeInfo: null,
    departAt: null,
  });
  const [isLoadingTravelTime, setIsLoadingTravelTime] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationRequested, setLocationRequested] = useState(false);

  const requestLocation = useCallback(() => {
    if ("geolocation" in navigator && !locationRequested) {
      setLocationRequested(true);

      const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

      if (isIOS) {
        // iOS-specific location request
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              long: position.coords.longitude,
            };
            console.log("iOS location obtained:", location);
            setUserLocation(location);
            setDebugData((prev) => ({
              ...prev,
              userLocation: location,
            }));
          },
          (error) => {
            console.error("iOS geolocation error:", error.code, error.message);
            setUserLocation(null);
            if (error.code === error.PERMISSION_DENIED) {
              setLocationRequested(false);
            }
          },
          {
            maximumAge: 50000,
            timeout: 20000,
            enableHighAccuracy: true,
          }
        );
      } else {
        // Android and other devices
        const options = {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        };

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              long: position.coords.longitude,
            };
            console.log("Android location obtained:", location);
            setUserLocation(location);
            setDebugData((prev) => ({
              ...prev,
              userLocation: location,
            }));
          },
          (error) => {
            console.error(
              "Android geolocation error:",
              error.code,
              error.message
            );
            setUserLocation(null);
            if (error.code === error.PERMISSION_DENIED) {
              setLocationRequested(false);
            }
          },
          options
        );
      }
    }
  }, [locationRequested]);

  const handleNumberChange = (fieldName) => (e) => {
    const value = Math.max(0, Math.min(999, parseInt(e.target.value) || 0));
    onFieldChange(fieldName)({ target: { value: value.toString() } });
  };

  const handleAirportSelect = (data) => {
    console.log("FlightForm received airport data:", data);
    setIsLoadingTravelTime(true);

    if (data.userLocation) {
      setUserLocation(data.userLocation);
      setDebugData((prev) => ({
        ...prev,
        userLocation: data.userLocation,
      }));
    }

    // Update the airport code in the form
    if (data.airport) {
      onFieldChange("airport")({ target: { value: data.airport.code } });
    }

    // If we got route info, update the driving time
    if (data.routeInfo) {
      onFieldChange("drivingTime")({
        target: { value: data.routeInfo.travelTimeMinutes.toString() },
      });
    }

    setDebugData((prev) => ({
      ...prev,
      airportData: data.airport,
      routeInfo: data.routeInfo,
      departAt: data.departAt,
    }));

    setIsLoadingTravelTime(false);
  };

  const anxietyLevel = formValues.anxietyLevel || 0;
  const extraMinutes = anxietyLevel * 5;

  return (
    <>
      <Form className={styles.sliderForm}>
        <div className={styles.formGroup}>
          <div className={styles.labelContainer}>
            <Form.Label className={styles.formLabel}>Travel Anxiety</Form.Label>
            <span className={styles.anxietyLevel}>LVL {anxietyLevel}</span>
            <InfoTooltip text="Adds 5 minutes of buffer time for each level of anxiety" />
          </div>
          <div className={sliderStyles.sliderContainer}>
            <div className={sliderStyles.sliderTrack} />
            <input
              type="range"
              min="0"
              max="10"
              value={anxietyLevel}
              onChange={(e) => onAnxietyChange(parseInt(e.target.value))}
              className={sliderStyles.sliderInput}
            />
            <div
              className={sliderStyles.sliderEmoji}
              style={{
                "--slider-percent": anxietyLevel / 10,
              }}
            >
              {getEmoji(anxietyLevel)}
            </div>
          </div>
          <div className={sliderStyles.anxietyText}>
            {getAnxietyText(anxietyLevel, extraMinutes)}
          </div>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.timeAirportContainer}>
            <div className={styles.halfWidth}>
              <label className={styles.formLabel}>Boarding Time</label>
              <input
                type="time"
                id="boardingTime"
                value={formValues.boardingTime}
                onChange={onFieldChange("boardingTime")}
                className={styles.timeInput}
              />
            </div>
            <div className={styles.halfWidth}>
              <label className={styles.formLabel}>Airport</label>
              <AirportAutocomplete
                value={formValues.airport || ""}
                onChange={(value) =>
                  onFieldChange("airport")({ target: { value } })
                }
                onAirportSelect={handleAirportSelect}
                boardingTime={formValues.boardingTime}
                selectedDate={selectedDate}
                userLocation={userLocation}
                onRequestLocation={requestLocation}
              />
            </div>
          </div>
        </div>

        <div className={styles.formGroup}>
          <Form.Label className={styles.formLabel}>
            TRAVEL TIME TO AIRPORT
          </Form.Label>
          <div
            className={`${styles.numberInputContainer} ${
              isLoadingTravelTime ? styles.loading : ""
            }`}
          >
            <Form.Control
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              id="drivingTime"
              value={formValues.drivingTime}
              onChange={handleNumberChange("drivingTime")}
              min="0"
              max="999"
              className={styles.numberControl}
              disabled={isLoadingTravelTime}
            />
            <div className={styles.numberButtonGroup}>
              <button
                type="button"
                className={`btn rounded-circle d-flex align-items-center justify-content-center ${styles.decrementButton}`}
                onClick={() =>
                  handleNumberChange("drivingTime")({
                    target: {
                      value: (parseInt(formValues.drivingTime) - 5).toString(),
                    },
                  })
                }
                disabled={isLoadingTravelTime}
              >
                −
              </button>
              <button
                type="button"
                className={`btn rounded-circle d-flex align-items-center justify-content-center ${styles.incrementButton}`}
                onClick={() =>
                  handleNumberChange("drivingTime")({
                    target: {
                      value: (parseInt(formValues.drivingTime) + 5).toString(),
                    },
                  })
                }
                disabled={isLoadingTravelTime}
              >
                +
              </button>
            </div>
            {isLoadingTravelTime && <div className={styles.loadingSpinner} />}
          </div>
        </div>

        <div className={styles.formGroup}>
          <Form.Label className={styles.formLabel}>
            BUFFER BEFORE BOARDING
          </Form.Label>
          <div className={styles.numberInputContainer}>
            <Form.Control
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              id="arriveEarly"
              value={formValues.arriveEarly}
              onChange={handleNumberChange("arriveEarly")}
              min="0"
              max="999"
              className={styles.numberControl}
            />
            <div className={styles.numberButtonGroup}>
              <button
                type="button"
                className={`btn rounded-circle d-flex align-items-center justify-content-center ${styles.decrementButton}`}
                onClick={() =>
                  handleNumberChange("arriveEarly")({
                    target: {
                      value: (parseInt(formValues.arriveEarly) - 5).toString(),
                    },
                  })
                }
              >
                −
              </button>
              <button
                type="button"
                className={`btn rounded-circle d-flex align-items-center justify-content-center ${styles.incrementButton}`}
                onClick={() =>
                  handleNumberChange("arriveEarly")({
                    target: {
                      value: (parseInt(formValues.arriveEarly) + 5).toString(),
                    },
                  })
                }
              >
                +
              </button>
            </div>
          </div>
        </div>

        <FlightCheckboxes
          formValues={formValues}
          onCheckboxChange={onCheckboxChange}
        />

        <div className={styles.formGroup}>
          <Form.Label className={styles.formLabel}>DEPARTURE DATE</Form.Label>
          <div className={styles.dateInputWrapper}>
            <DatePicker
              selected={selectedDate}
              onChange={onDateChange}
              dateFormat="yyyy-MM-dd"
              className={styles.dateInput}
            />
          </div>
        </div>
      </Form>
      <DebugInfo {...debugData} />
    </>
  );
};
