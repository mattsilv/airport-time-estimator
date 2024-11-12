import React from "react";
import { Alert, Stack } from "react-bootstrap";
import { FlightForm } from "../components/FlightForm";
import { useFlightForm } from "../hooks/useFlightForm";
import { useCalenderLink } from "../hooks/useCalenderLink";
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

  const calendarLinkStyle = {
    color: "#007AFF",
    textDecoration: "none",
    fontWeight: "400",
    fontSize: "0.95rem",
    letterSpacing: "-0.01em",
    marginBottom: "0.75rem",
  };

  return (
    <Stack className="mt-0" gap={1}>
      <div className="px-4 pt-2 pb-2 bg-light">
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
              {calendarURL && (
                <a
                  href={calendarURL}
                  style={calendarLinkStyle}
                  className="mx-auto"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Add to Calendar
                </a>
              )}

              <button
                className="btn btn-secondary mx-auto mb-2"
                onClick={handleReset}
                style={{
                  fontSize: "0.95rem",
                  fontWeight: "400",
                  letterSpacing: "-0.01em",
                }}
              >
                Reset
              </button>

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
          </Stack>
        )}
      </div>
    </Stack>
  );
}
