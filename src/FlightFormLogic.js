import React, { useCallback, useEffect, useState } from "react";
import FlightFormInputs from "./components/FlightFormInputs";
import CalendarLink from "./components/CalendarLink";
import { useNavigate, useLocation } from "react-router-dom";
import { formatTime, parseTimeString } from "./utils/timeUtils";
import useFormState from "./hooks/useFormState";
import useUrlParams from "./hooks/useUrlParams";
import { getDefaultDate } from "./utils/dateUtils";
import { parseISO, isValid, isAfter } from "date-fns"; // Import isAfter

const formFieldsConfig = [
  { name: "departureTime", defaultValue: "11:00" },
  { name: "drivingTime", defaultValue: "45" },
  { name: "arriveEarly", defaultValue: "30" },
  { name: "snackTime", defaultValue: "5" },
];

const FlightFormLogic = ({ onCalculate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const defaultDate = getDefaultDate(location);

  const {
    formValues,
    selectedDate,
    boardingTime,
    isInitialLoad,
    handleFieldChange,
    setSelectedDate,
    setBoardingTime,
    resetFields,
    setIsInitialLoad,
  } = useFormState(formFieldsConfig, defaultDate);

  const [leaveTime, setLeaveTime] = useState("");

  useUrlParams(
    formValues,
    selectedDate,
    isInitialLoad,
    formFieldsConfig,
    defaultDate
  );

  const calculateLeaveTime = useCallback(() => {
    if (!boardingTime) {
      console.log("Boarding time is not set yet.");
      return;
    }

    const { hours: boardingHours, minutes: boardingMinutes } =
      parseTimeString(boardingTime);

    const totalMinutes =
      parseInt(formValues.drivingTime, 10) +
      parseInt(formValues.arriveEarly, 10) +
      parseInt(formValues.snackTime, 10);

    let leaveDate;
    if (typeof selectedDate === "string") {
      leaveDate = parseISO(selectedDate);
      if (!isValid(leaveDate)) {
        console.error("Invalid leave date:", leaveDate);
        return;
      }
    } else {
      leaveDate = new Date(selectedDate);
    }

    leaveDate.setHours(boardingHours);
    leaveDate.setMinutes(boardingMinutes - totalMinutes);

    const formattedLeaveTime = formatTime(leaveDate);
    console.log(`Calculated leave time: ${formattedLeaveTime}`);

    if (formattedLeaveTime) {
      onCalculate(formattedLeaveTime);
      setLeaveTime(formattedLeaveTime);
      console.log(`Leave time set to: ${formattedLeaveTime}`);
    }
  }, [boardingTime, formValues, selectedDate, onCalculate]);

  useEffect(() => {
    if (
      formValues.departureTime &&
      boardingTime &&
      formValues.drivingTime &&
      formValues.arriveEarly &&
      formValues.snackTime &&
      selectedDate
    ) {
      calculateLeaveTime();
    }
  }, [
    formValues.departureTime,
    boardingTime,
    formValues.drivingTime,
    formValues.arriveEarly,
    formValues.snackTime,
    selectedDate,
    calculateLeaveTime,
  ]);

  const handleDateChange = (date) => {
    const now = new Date();
    if (isAfter(date, now)) {
      setSelectedDate(date);
      setIsInitialLoad(false);
      console.log(`Future date selected: ${date}`);
    } else {
      setSelectedDate(date);
      setIsInitialLoad(false);
      console.log(`Past date or today selected: ${date}`);
    }
  };

  const handleReset = () => {
    resetFields();
    setBoardingTime("");
    setLeaveTime("");
    navigate("/", { replace: true });
    console.log("Reset button clicked, URL and state reset");
  };

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
