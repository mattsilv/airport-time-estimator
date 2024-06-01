import React from 'react';
import {Alert, Stack} from 'react-bootstrap';
import FlightForm from '../components/FlightForm';
import useFlightForm from '../hooks/useFlightForm';
import {useGlobalState} from '../context/GlobalStateContext';
import useCalenderLink from '../hooks/useCalenderLink';

function Home() {
  const {leaveTime} = useGlobalState();

  const {
    formValues,
    selectedDate,
    boardingTime,
    handleFieldChange,
    handleDateChange,
    handleReset,
    handleCalculateLeaveTime,
  } = useFlightForm();

  const {createGoogleCalendarLink} = useCalenderLink();

  return (
    <Stack className="mt-4" gap={3}>
      <div>
        <h1 className="text-center">
          What time should I leave for the airport?
        </h1>
      </div>

      <div className="mt-4 p-4 border rounded shadow-sm bg-light">
        <FlightForm
          formValues={formValues}
          selectedDate={selectedDate}
          boardingTime={boardingTime}
          onFieldChange={handleFieldChange}
          onDateChange={handleDateChange}
          onCalculate={handleCalculateLeaveTime}
        />

        {!!leaveTime && leaveTime !== '00:00' && (
          <Stack gap={2} className="mt-3 mx-auto">
            <div>
              <Alert variant="info" className="text-center">
                {leaveTime}
              </Alert>
            </div>

            <div className="text-center">
              <a
                href={createGoogleCalendarLink(leaveTime, selectedDate)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Add to Calendar
              </a>
            </div>

            <div className="text-center">
              <button className="btn btn-secondary" onClick={handleReset}>
                Reset
              </button>
            </div>
          </Stack>
        )}
      </div>
    </Stack>
  );
}

export default Home;
