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
      const anxietyMinutes = (parseInt(newValues.anxietyLevel) || 0) * 5;

      const totalBuffer =
        baseArriveEarly +
        internationalBuffer +
        tsaBuffer +
        snackBuffer +
        anxietyMinutes;

      return {
        ...newValues,
        arriveEarly: totalBuffer.toString(),
      };
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
    const { drivingTime, arriveEarly, snackTime } = formValues;
    const totalMinutes =
      parseInt(drivingTime || 0, 10) +
      parseInt(arriveEarly || 0, 10) +
      parseInt(snackTime || 0, 10);

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
  };
}
