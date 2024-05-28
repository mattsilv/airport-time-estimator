// src/FlightFormLogic.js
import React, { useState, useEffect, useCallback } from "react";
import FlightFormInputs from "./FlightFormInputs";

const FlightFormLogic = ({ onCalculate }) => {
  const [departureTime, setDepartureTime] = useState("11:00");
  const [boardingTime, setBoardingTime] = useState("");
  const [drivingTime, setDrivingTime] = useState("45");
  const [arriveEarly, setArriveEarly] = useState("30");
  const [snackTime, setSnackTime] = useState("5");

  const calculateLeaveTime = useCallback(() => {
    const totalMinutes =
      parseInt(drivingTime, 10) +
      parseInt(arriveEarly, 10) +
      parseInt(snackTime, 10);
    onCalculate(boardingTime, totalMinutes);
  }, [boardingTime, drivingTime, arriveEarly, snackTime, onCalculate]);

  useEffect(() => {
    if (departureTime) {
      const [hours, minutes] = departureTime.split(":").map(Number);
      const boardingDate = new Date();
      boardingDate.setHours(hours);
      boardingDate.setMinutes(minutes - 30);
      setBoardingTime(boardingDate.toTimeString().substring(0, 5));
    }
  }, [departureTime]);

  useEffect(() => {
    calculateLeaveTime();
  }, [calculateLeaveTime]);

  const handleDepartureChange = (e) => {
    setDepartureTime(e.target.value);
  };

  const handleDrivingTimeChange = (e) => {
    setDrivingTime(e.target.value);
  };

  const handleArriveEarlyChange = (e) => {
    setArriveEarly(e.target.value);
  };

  const handleSnackTimeChange = (e) => {
    setSnackTime(e.target.value);
  };

  return (
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
    />
  );
};

export default FlightFormLogic;
