import React from 'react';
import {Alert, Stack} from 'react-bootstrap';
import {FlightForm} from '../components/FlightForm';
import {useFlightForm} from '../hooks/useFlightForm';
import {useCalenderLink} from '../hooks/useCalenderLink';

export function Home() {
  const {
    leaveTime,
    formValues,
    selectedDate,
    boardingTime,
    handleFieldChange,
    handleDateChange,
    handleBoardingTimeChange,
    handleReset,
  } = useFlightForm();

  const {calendarURL} = useCalenderLink(leaveTime, selectedDate);

  return (
    <Stack className="mt-3" gap={2}>
      <div>
        <h3 className="text-center">
          What time should I leave for the airport?
        </h3>
      </div>

      <div className="px-4 pt-4 border rounded shadow-sm bg-light">
        <FlightForm
          formValues={formValues}
          selectedDate={selectedDate}
          boardingTime={boardingTime}
          onBoardingTimeChange={handleBoardingTimeChange}
          onFieldChange={handleFieldChange}
          onDateChange={handleDateChange}
        />

        {!!leaveTime && leaveTime !== '00:00' && (
          <Stack gap={2} className="mt-3 mx-auto">
            <Alert variant="info" className="text-center">
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
