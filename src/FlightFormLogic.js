import React, { useState, useEffect, useCallback } from "react";
import FlightFormInputs from "./components/FlightFormInputs";
import { addDays } from "date-fns";
import { useNavigate, useLocation } from "react-router-dom";
import CalendarLink from "./components/CalendarLink";
import {
  formatTime,
  parseTimeString,
  formatInputTime,
} from "./utils/timeUtils";

const FlightFormLogic = ({ onCalculate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const defaultDepartureTime = "11:00";
  const defaultDrivingTime = "45";
  const defaultArriveEarly = "30";
  const defaultSnackTime = "5";
  const defaultDate = addDays(new Date(), 1);

  const getDefaultDate = () => {
    const dateParam = params.get("date");
    if (dateParam) {
      const date = new Date(dateParam);
      return date < new Date() ? defaultDate : date;
    }
    return defaultDate;
  };

  const [departureTime, setDepartureTime] = useState(
    params.get("departureTime") || defaultDepartureTime
  );
  const [boardingTime, setBoardingTime] = useState("");
  const [drivingTime, setDrivingTime] = useState(
    params.get("drivingTime") || defaultDrivingTime
  );
  const [arriveEarly, setArriveEarly] = useState(
    params.get("arriveEarly") || defaultArriveEarly
  );
  const [snackTime, setSnackTime] = useState(
    params.get("snackTime") || defaultSnackTime
  );
  const [selectedDate, setSelectedDate] = useState(getDefaultDate());
  const [isDefault, setIsDefault] = useState(true);
  const [leaveTime, setLeaveTime] = useState("");

  const updateURLParams = () => {
    if (isDefault) return;
    const searchParams = new URLSearchParams();
    searchParams.set("departureTime", departureTime);
    searchParams.set("drivingTime", drivingTime);
    searchParams.set("arriveEarly", arriveEarly);
    searchParams.set("snackTime", snackTime);
    searchParams.set("date", selectedDate.toISOString().split("T")[0]);
    navigate({ search: searchParams.toString() });
  };

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
    if (boardingTime) {
      calculateLeaveTime();
    }
  }, [boardingTime, calculateLeaveTime]);

  useEffect(() => {
    updateURLParams();
    calculateLeaveTime();
  }, [
    departureTime,
    drivingTime,
    arriveEarly,
    snackTime,
    selectedDate,
    calculateLeaveTime,
  ]);

  const handleDepartureChange = (e) => {
    setDepartureTime(e.target.value);
    setIsDefault(false);
  };

  const handleDrivingTimeChange = (e) => {
    setDrivingTime(e.target.value);
    setIsDefault(false);
  };

  const handleArriveEarlyChange = (e) => {
    setArriveEarly(e.target.value);
    setIsDefault(false);
  };

  const handleSnackTimeChange = (e) => {
    setSnackTime(e.target.value);
    setIsDefault(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsDefault(false);
  };

  const handleReset = () => {
    setDepartureTime(defaultDepartureTime);
    setBoardingTime("");
    setDrivingTime(defaultDrivingTime);
    setArriveEarly(defaultArriveEarly);
    setSnackTime(defaultSnackTime);
    setSelectedDate(defaultDate);
    setIsDefault(true);
    setLeaveTime("");
    navigate({ search: "" });
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
