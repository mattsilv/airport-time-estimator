import { useState, useEffect } from "react";
import { parseTimeString, formatInputTime } from "../utils/timeUtils";

const useFormState = (formFieldsConfig, defaultDate) => {
  const [formValues, setFormValues] = useState(() =>
    formFieldsConfig.reduce((acc, field) => {
      const params = new URLSearchParams(window.location.search);
      acc[field.name] = params.get(field.name) || field.defaultValue;
      return acc;
    }, {})
  );
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [boardingTime, setBoardingTime] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const handleFieldChange = (name) => (e) => {
    const newValue = e.target.value;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: newValue,
    }));
    setIsInitialLoad(false);
  };

  const resetFields = () => {
    setFormValues(
      formFieldsConfig.reduce((acc, field) => {
        acc[field.name] = field.defaultValue;
        return acc;
      }, {})
    );
    setSelectedDate(defaultDate);
    setIsInitialLoad(true);
  };

  useEffect(() => {
    if (isInitialLoad) {
      const [hours, minutes] = formValues.departureTime.split(":").map(Number);
      const boardingDate = new Date(selectedDate);
      boardingDate.setHours(hours);
      boardingDate.setMinutes(minutes - 30);
      const newBoardingTime = formatInputTime(boardingDate);
      setBoardingTime(newBoardingTime);
    }
  }, [formValues.departureTime, selectedDate, isInitialLoad]);

  return {
    formValues,
    selectedDate,
    boardingTime,
    isInitialLoad,
    handleFieldChange,
    setSelectedDate,
    setBoardingTime,
    resetFields,
    setIsInitialLoad, // Make sure to return setIsInitialLoad
  };
};

export default useFormState;
