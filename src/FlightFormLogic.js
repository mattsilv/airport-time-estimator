import React from "react";
import FlightFormInputs from "./components/FlightFormInputs";
import CalendarLink from "./components/CalendarLink";
import useFlightForm from "./hooks/useFlightForm";

const FlightFormLogic = ({ onCalculate }) => {
  const {
    formValues,
    selectedDate,
    boardingTime,
    leaveTime,
    handleFieldChange,
    handleDateChange,
    handleReset,
  } = useFlightForm(onCalculate);

  return (
    <div>
      <FlightFormInputs
        formValues={formValues}
        handleFieldChange={handleFieldChange}
        selectedDate={selectedDate}
        handleDateChange={handleDateChange}
        boardingTime={boardingTime}
      />
      <CalendarLink leaveTime={leaveTime} selectedDate={selectedDate} />
      <div className="text-center mt-3">
        <button className="btn btn-secondary" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default FlightFormLogic;
