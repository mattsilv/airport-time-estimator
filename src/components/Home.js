import React from "react";
import { Alert, Stack } from "react-bootstrap";
import { FlightForm } from "../components/FlightForm";
import { useFlightForm } from "../hooks/useFlightForm";
import { useCalenderLink } from "../hooks/useCalenderLink";
import { FeatureRequests } from "../components/FeatureRequests";
import { DebugInfo } from "../components/DebugInfo";
import styles from "../styles/Home.module.css";

export function Home() {
  const {
    leaveTime,
    formValues,
    selectedDate,
    handleFieldChange,
    handleDateChange,
    handleReset,
    handleAnxietyChange,
    handleCheckboxChange,
  } = useFlightForm();

  const { calendarURL } = useCalenderLink(leaveTime, selectedDate);

  return (
    <Stack className="mt-0" gap={1}>
      <div
        className="px-4 pt-2 pb-2"
        style={{
          backgroundColor: "var(--bg-primary)",
          color: "var(--text-primary)",
        }}
      >
        <FlightForm
          formValues={formValues}
          selectedDate={selectedDate}
          onFieldChange={handleFieldChange}
          onDateChange={handleDateChange}
          onAnxietyChange={handleAnxietyChange}
          onCheckboxChange={handleCheckboxChange}
        />

        {!!leaveTime && leaveTime !== "00:00" && (
          <Stack gap={1} className="mt-0">
            <Alert variant="info" className="text-center py-2 mb-2">
              <div className="mb-1">Leave for the airport by:</div>
              <Alert.Heading className="mb-0">✈️ {leaveTime}</Alert.Heading>
            </Alert>

            <Stack className="mb-2">
              <div className="d-flex gap-3 justify-content-center">
                <button
                  className="btn btn-success d-flex align-items-center gap-2"
                  onClick={() => window.open(calendarURL, "_blank")}
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: "400",
                    letterSpacing: "-0.01em",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                  </svg>
                  Add to Calendar
                </button>

                <button
                  className="btn btn-outline-secondary"
                  onClick={handleReset}
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: "400",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Reset
                </button>
              </div>
            </Stack>

            <p className={styles.footerText}>
              a silly{" "}
              <a
                href="https://github.com/mattsilv/airport-time-estimator"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerLink}
              >
                open-source
              </a>{" "}
              app by{" "}
              <a
                href="https://silv.blog"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerLink}
              >
                silv.eth
              </a>
            </p>
          </Stack>
        )}

        <FeatureRequests />

        <DebugInfo
          userLocation={formValues.userLocation}
          airportData={formValues.airport}
          routeInfo={formValues.routeInfo}
          departAt={formValues.departAt}
        />
      </div>
    </Stack>
  );
}
