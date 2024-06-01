import React from 'react';
import {Alert, Stack} from 'react-bootstrap';
import FlightForm from '../components/FlightForm';
import CalendarLink from '../components/CalendarLink';
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

  const calendarLink = useCalenderLink(leaveTime, selectedDate);

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
          <div className="text-center mt-3">
            <div className="text-center mt-3">
              <button className="btn btn-secondary" onClick={handleReset}>
                Reset
              </button>
            </div>

            <div className="text-center mt-3">
              <Alert variant="info" className="text-center mt-3">
                {leaveTime}
              </Alert>

              <CalendarLink link={calendarLink} />
            </div>
          </div>
        )}
      </div>
    </Stack>
  );
}

export default Home;
