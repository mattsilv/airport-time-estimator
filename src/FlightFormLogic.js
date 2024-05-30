import React from "react";
import FlightFormInputs from "./components/FlightFormInputs";
import CalendarLink from "./components/CalendarLink";
import useFlightForm from "./hooks/useFlightForm";
import {
  useGlobalState,
  useGlobalDispatch,
} from "./context/GlobalStateContext";

const FlightFormLogic = () => {
  const { leaveTime } = useGlobalState();
  const dispatch = useGlobalDispatch();

  const handleCalculate = (leaveTimeString) => {
    dispatch({
      type: "SET_LEAVE_TIME",
      payload: `You should leave at: ${leaveTimeString}`,
    });
  };

  const {
    formValues,
    selectedDate,
    boardingTime,
    handleFieldChange,
    handleDateChange,
    handleReset,
  } = useFlightForm(handleCalculate);

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
