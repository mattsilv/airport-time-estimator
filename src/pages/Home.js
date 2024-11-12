import React from "react";
import { Alert, Stack } from "react-bootstrap";
import { FlightForm } from "../components/FlightForm";
import { useFlightForm } from "../hooks/useFlightForm";
import { useCalenderLink } from "../hooks/useCalenderLink";

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
    <Stack className="mt-0" gap={2}>
      <div
        className="px-4 pt-4 bg-light"
        style={{
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          borderRadius: "0 0 8px 8px",
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
          <Stack gap={2} className="mt-3 mx-auto">
            <Alert variant="info" className="text-center">
              <div className="mb-2">Leave for the airport by:</div>
              <Alert.Heading className="mb-0">✈️ {leaveTime}</Alert.Heading>
            </Alert>

            <Stack className="mb-4">
              {calendarURL && (
                <a
                  href={calendarURL}
                  className="mb-4 mx-auto"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Add to Calendar
                </a>
              )}

              <button
                className="btn btn-secondary mx-auto"
                onClick={handleReset}
              >
                Reset
              </button>
            </Stack>
          </Stack>
        )}
      </div>
    </Stack>
  );
}
