import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { parseISO, isValid, isAfter } from "date-fns";
import useFormState from "./useFormState";
import useUrlParams from "./useUrlParams";
import { getDefaultDate } from "../utils/dateUtils";
import { formatTime, parseTimeString } from "../utils/timeUtils";
import formFieldsConfig from "../config/formFieldsConfig";

const useFlightForm = (onCalculate) => {
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

  return {
    formValues,
    selectedDate,
    boardingTime,
    leaveTime,
    handleFieldChange,
    handleDateChange,
    handleReset,
  };
};

export default useFlightForm;
