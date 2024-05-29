import React, { useState, useEffect, useCallback } from "react";
import FlightFormInputs from "./components/FlightFormInputs";
import { addDays } from "date-fns";
import CalendarLink from "./components/CalendarLink";
import useFormField from "./hooks/useFormField";
import {
  formatTime,
  parseTimeString,
  formatInputTime,
} from "./utils/timeUtils";

const FlightFormLogic = ({ onCalculate }) => {
  const defaultDate = addDays(new Date(), 1);

  const getDefaultDate = () => {
    const params = new URLSearchParams(window.location.search);
    const dateParam = params.get("date");
    if (dateParam) {
      const date = new Date(dateParam);
      return date < new Date() ? defaultDate : date;
    }
    return defaultDate;
  };

  const {
    value: departureTime,
    handleChange: handleDepartureChange,
    handleReset: resetDepartureTime,
  } = useFormField("departureTime", "11:00");
  const {
    value: drivingTime,
    handleChange: handleDrivingTimeChange,
    handleReset: resetDrivingTime,
  } = useFormField("drivingTime", "45");
  const {
    value: arriveEarly,
    handleChange: handleArriveEarlyChange,
    handleReset: resetArriveEarly,
  } = useFormField("arriveEarly", "30");
  const {
    value: snackTime,
    handleChange: handleSnackTimeChange,
    handleReset: resetSnackTime,
  } = useFormField("snackTime", "5");

  const [boardingTime, setBoardingTime] = useState("");
  const [selectedDate, setSelectedDate] = useState(getDefaultDate());
  const [leaveTime, setLeaveTime] = useState("");

  const calculateLeaveTime = useCallback(() => {
    if (!boardingTime) {
      console.log("Boarding time is not set yet.");
      return;
    }

    const { hours: boardingHours, minutes: boardingMinutes } =
      parseTimeString(boardingTime);

    const totalMinutes =
      parseInt(drivingTime, 10) +
      parseInt(arriveEarly, 10) +
      parseInt(snackTime, 10);

    const leaveDate = new Date(selectedDate);
    leaveDate.setHours(boardingHours);
    leaveDate.setMinutes(boardingMinutes - totalMinutes);

    if (isNaN(leaveDate.getTime())) {
      console.error("Invalid leave date:", leaveDate);
      return;
    }

    const formattedLeaveTime = formatTime(leaveDate);
    console.log(`Calculated leave time: ${formattedLeaveTime}`);

    if (formattedLeaveTime) {
      onCalculate(formattedLeaveTime);
      setLeaveTime(formattedLeaveTime);
    }
  }, [
    boardingTime,
    drivingTime,
    arriveEarly,
    snackTime,
    selectedDate,
    onCalculate,
  ]);

  useEffect(() => {
    if (departureTime) {
      const [hours, minutes] = departureTime.split(":").map(Number);
      const boardingDate = new Date(selectedDate);
      boardingDate.setHours(hours);
      boardingDate.setMinutes(minutes - 30);
      const newBoardingTime = formatInputTime(boardingDate);
      setBoardingTime(newBoardingTime);
      console.log("Calculated Boarding Time:", newBoardingTime);
    }
  }, [departureTime, selectedDate]);

  useEffect(() => {
    if (
      departureTime &&
      boardingTime &&
      drivingTime &&
      arriveEarly &&
      snackTime &&
      selectedDate
    ) {
      calculateLeaveTime();
    }
  }, [
    departureTime,
    boardingTime,
    drivingTime,
    arriveEarly,
    snackTime,
    selectedDate,
    calculateLeaveTime,
  ]);

  useEffect(() => {
    const [hours, minutes] = departureTime.split(":").map(Number);
    const boardingDate = new Date(selectedDate);
    boardingDate.setHours(hours);
    boardingDate.setMinutes(minutes - 30);
    const newBoardingTime = formatInputTime(boardingDate);
    setBoardingTime(newBoardingTime);
    console.log("Initial boarding time set:", newBoardingTime);
  }, [departureTime, selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleReset = () => {
    resetDepartureTime();
    setBoardingTime("");
    resetDrivingTime();
    resetArriveEarly();
    resetSnackTime();
    setSelectedDate(defaultDate);
    setLeaveTime("");
  };

  return (
    <div>
      <FlightFormInputs
        departureTime={departureTime}
        boardingTime={boardingTime}
        drivingTime={drivingTime}
        arriveEarly={arriveEarly}
        snackTime={snackTime}
        handleDepartureChange={handleDepartureChange}
        handleDrivingTimeChange={handleDrivingTimeChange}
        handleArriveEarlyChange={handleArriveEarlyChange}
        handleSnackTimeChange={handleSnackTimeChange}
        selectedDate={selectedDate}
        handleDateChange={handleDateChange}
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
