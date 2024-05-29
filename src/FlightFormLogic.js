// src/FlightFormLogic.js
import React, { useState, useEffect, useCallback } from "react";
import FlightFormInputs from "./FlightFormInputs";
import { format, addDays } from "date-fns";

const FlightFormLogic = ({ onCalculate }) => {
  const [departureTime, setDepartureTime] = useState("11:00");
  const [boardingTime, setBoardingTime] = useState("");
  const [drivingTime, setDrivingTime] = useState("45");
  const [arriveEarly, setArriveEarly] = useState("30");
  const [snackTime, setSnackTime] = useState("5");
  const [selectedDate, setSelectedDate] = useState(addDays(new Date(), 1));
  const [calendarLink, setCalendarLink] = useState("");

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

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const formatDateTime = (date, time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const formattedDate = new Date(date);
    formattedDate.setHours(hours);
    formattedDate.setMinutes(minutes);
    return format(formattedDate, "yyyyMMdd'T'HHmmss");
  };

  const createGoogleCalendarLink = () => {
    const formattedStart = formatDateTime(selectedDate, departureTime);
    const formattedEnd = formatDateTime(selectedDate, departureTime);
    const baseURL = "https://www.google.com/calendar/render";
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: "Depart for Airport",
      dates: `${formattedStart}/${formattedEnd}`,
      details:
        "Time to leave for the airport. Created by https://airportcalc.silv.app/",
    });
    setCalendarLink(`${baseURL}?${params.toString()}`);
  };

  useEffect(() => {
    createGoogleCalendarLink();
  }, [departureTime, selectedDate]);

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
      <div className="text-center mt-3">
        <a href={calendarLink} target="_blank" rel="noopener noreferrer">
          Add to Calendar
        </a>
      </div>
    </div>
  );
};

export default FlightFormLogic;
