import React from 'react';
import {Row, Col, Alert} from 'react-bootstrap';
import FlightFormInputs from '../components/FlightFormInputs';
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
    <Row className="justify-content-center">
      <Col xs={12}>
        <h1 className="text-center">
          What time should I leave for the airport?
        </h1>

        <div className="border p-4 rounded shadow-sm bg-light">
          <FlightFormInputs
            formValues={formValues}
            selectedDate={selectedDate}
            boardingTime={boardingTime}
            onFieldChange={handleFieldChange}
            onDateChange={handleDateChange}
            onCalculate={handleCalculateLeaveTime}
          />

          <CalendarLink link={calendarLink} />

          <div className="text-center mt-3">
            <button className="btn btn-secondary" onClick={handleReset}>
              Reset
            </button>
          </div>

          {leaveTime && (
            <Alert variant="info" className="text-center mt-3">
              {leaveTime}
            </Alert>
          )}
        </div>
      </Col>
    </Row>
  );
}

export default Home;
