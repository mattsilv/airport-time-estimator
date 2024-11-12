import { useState, useEffect } from "react";
import { isValid } from "date-fns";
import { formFieldsConfig } from "../config/formFieldsConfig";
import { getDefaultDate, parseDate } from "../utils/dateUtils";
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

  const initialDate = parseDate(defaultDate);
  const [selectedDate, setSelectedDate] = useState(
    isValid(initialDate) ? initialDate : new Date()
  );
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
    if (formValues.boardingTime) {
      const [hours, minutes] = formValues.boardingTime.split(":").map(Number);
      const boardingDate = new Date(selectedDate);
      boardingDate.setHours(hours);
      boardingDate.setMinutes(minutes);
    }
  }, [formValues.boardingTime, selectedDate]);

  return {
    formValues,
    selectedDate,
    isInitialLoad,
    handleFieldChange,
    setSelectedDate,
    resetFields,
    setIsInitialLoad,
    setFormValues,
  };
}
