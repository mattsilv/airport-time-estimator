import { useState, useEffect } from "react";
import { formatInputTime } from "../utils/timeUtils";
import { parseISO, isValid } from "date-fns";
import { formFieldsConfig } from "../config/formFieldsConfig";
import { getDefaultDate } from "../utils/dateUtils";
import { useLocation } from "react-router-dom";

export function useFormState() {
  const location = useLocation();
  const defaultDate = getDefaultDate(location);

  const [formValues, setFormValues] = useState(() =>
    formFieldsConfig.reduce((acc, field) => {
      const params = new URLSearchParams(location.search);
      acc[field.name] = params.get(field.name) ?? field.defaultValue;
      return acc;
    }, {})
  );

  const initialDate =
    typeof defaultDate === "string"
      ? parseISO(defaultDate)
      : new Date(defaultDate);
  const [selectedDate, setSelectedDate] = useState(
    isValid(initialDate) ? initialDate : new Date()
  );
  const [boardingTime, setBoardingTime] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const handleFieldChange = (name) => (e) => {
    const { value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
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
    setSelectedDate(isValid(initialDate) ? initialDate : new Date());
    setIsInitialLoad(true);
  };

  useEffect(() => {
    const [hours, minutes] = formValues.departureTime.split(":").map(Number);
    const boardingDate = new Date(selectedDate);
    boardingDate.setHours(hours);
    boardingDate.setMinutes(minutes - 30);
    const newBoardingTime = formatInputTime(boardingDate);
    setBoardingTime(newBoardingTime);
  }, [formValues.departureTime, selectedDate]);

  return {
    formValues,
    selectedDate,
    boardingTime,
    isInitialLoad,
    handleFieldChange,
    setSelectedDate,
    setBoardingTime,
    resetFields,
    setIsInitialLoad,
  };
}
