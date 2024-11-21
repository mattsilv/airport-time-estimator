import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { parseISO, isValid, isAfter } from "date-fns";
import { formatTime, parseTimeString } from "../utils/timeUtils";
import { useFormState } from "./useFormState";

export function useFlightForm() {
  const navigate = useNavigate();

  const [leaveTime, setLeaveTime] = useState(null);

  const {
    formValues,
    selectedDate,
    handleFieldChange,
    setSelectedDate,
    resetFields,
    setIsInitialLoad,
    setFormValues,
  } = useFormState();

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
    setLeaveTime(null);
    navigate("/", { replace: true });
    console.log("Reset button clicked, URL and state reset");
  };

  const handleAnxietyChange = (level) => {
    const baseArriveEarly = 30;
    const internationalBuffer = formValues.isInternational ? 40 : 0;
    const tsaBuffer = formValues.noTSAPre ? 15 : 0;
    const snackBuffer = formValues.needSnacks ? 10 : 0;
    const parkingBuffer = formValues.needParking ? 15 : 0;
    const additionalMinutes = level * 5;

    const totalBuffer =
      baseArriveEarly +
      internationalBuffer +
      tsaBuffer +
      snackBuffer +
      parkingBuffer +
      additionalMinutes;

    setFormValues((prev) => ({
      ...prev,
      anxietyLevel: level,
      arriveEarly: totalBuffer.toString(),
    }));
  };

  const handleCheckboxChange = (name, checked) => {
    setFormValues((prev) => {
      const newValues = {
        ...prev,
        [name]: checked,
      };

      const baseArriveEarly = 30;
      const internationalBuffer = newValues.isInternational ? 40 : 0;
      const tsaBuffer = newValues.noTSAPre ? 15 : 0;
      const snackBuffer = newValues.needSnacks ? 10 : 0;
      const parkingBuffer = newValues.needParking ? 15 : 0;
      const tsaArgumentBuffer = newValues.tsaArgument ? 3 : 0;
      const checkingBagsBuffer = newValues.checkingBags ? 20 : 0;
      const anxietyMinutes = (parseInt(newValues.anxietyLevel) || 0) * 5;

      const totalBuffer =
        baseArriveEarly +
        internationalBuffer +
        tsaBuffer +
        snackBuffer +
        parkingBuffer +
        tsaArgumentBuffer +
        checkingBagsBuffer +
        anxietyMinutes;

      return {
        ...newValues,
        arriveEarly: totalBuffer.toString(),
      };
    });
  };

  const handleAirportSelect = (data) => {
    console.log("handleAirportSelect received:", data);

    setFormValues((prev) => {
      const newValues = {
        ...prev,
        airport: data.airport
          ? {
              code: data.airport.code,
              display: data.airport.display,
              lat: data.airport.lat,
              long: data.airport.long,
            }
          : null,
        routeInfo: data.routeInfo
          ? {
              distance: data.routeInfo.distance || 0,
              duration: data.routeInfo.duration || 0,
              travelTimeMinutes: data.routeInfo.travelTimeMinutes || 0,
            }
          : null,
        userLocation: data.userLocation || prev.userLocation,
        drivingTime: data.routeInfo
          ? Math.ceil(data.routeInfo.travelTimeMinutes || 0).toString()
          : prev.drivingTime,
      };

      console.log("Updated form values:", newValues);
      return newValues;
    });
  };

  useEffect(() => {
    if (!formValues.boardingTime) {
      console.log("Boarding time is not set yet.");
      return;
    }

    const { hours: boardingHours, minutes: boardingMinutes } = parseTimeString(
      formValues.boardingTime
    );

    const totalMinutes =
      parseInt(formValues.drivingTime || 0, 10) +
      parseInt(formValues.arriveEarly || 0, 10);

    const finalTotalMinutes = formValues.withKids
      ? Math.ceil(totalMinutes * 1.15)
      : totalMinutes;

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
    leaveDate.setMinutes(boardingMinutes - finalTotalMinutes);

    const formattedLeaveTime = formatTime(leaveDate);
    console.log(`Calculated leave time: ${formattedLeaveTime}`);
    console.log(
      `Kids buffer applied: ${formValues.withKids ? "Yes (+15%)" : "No"}`
    );

    if (formattedLeaveTime) {
      setLeaveTime(formattedLeaveTime);
    }
  }, [formValues, selectedDate]);

  return {
    formValues,
    selectedDate,
    leaveTime,
    handleFieldChange,
    handleDateChange,
    handleReset,
    handleAnxietyChange,
    handleCheckboxChange,
    handleAirportSelect,
  };
}
