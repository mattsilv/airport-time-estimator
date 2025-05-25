import { useState, useCallback, useEffect } from "react";
import { isValid } from "date-fns";
import { formFieldsConfig } from "../config/formFieldsConfig";
import { getDefaultDate, parseDate } from "../utils/dateUtils";
import { useLocation } from "react-router-dom";

export function useFormState() {
  const location = useLocation();
  const defaultDate = getDefaultDate(location);
  const initialDate = parseDate(defaultDate);

  const initialState = {
    boardingTime: "",
    airport: null,
    drivingTime: "0",
    anxietyLevel: "0",
    isInternational: false,
    noTSAPre: false,
    needSnacks: false,
    needParking: false,
    tsaArgument: false,
    checkingBags: false,
    withKids: false,
    userLocation: null,
    routeInfo: null,
  };

  const [formValues, setFormValues] = useState(() => ({
    ...initialState,
    ...formFieldsConfig.reduce((acc, field) => {
      const params = new URLSearchParams(location.search);
      acc[field.name] = params.get(field.name) ?? field.defaultValue;
      return acc;
    }, {}),
  }));

  const [selectedDate, setSelectedDate] = useState(
    isValid(initialDate) ? initialDate : new Date()
  );
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const handleFieldChange = useCallback(
    (name) => (e) => {
      const { value } = e.target;
      setFormValues((prev) => ({
        ...prev,
        [name]: value,
      }));
      setIsInitialLoad(false);
    },
    []
  );

  const resetFields = useCallback(() => {
    const defaultValues = formFieldsConfig.reduce((acc, field) => {
      acc[field.name] = field.defaultValue;
      return acc;
    }, {});
    setFormValues(defaultValues);
    setSelectedDate(isValid(initialDate) ? initialDate : new Date());
    setIsInitialLoad(true);
  }, [initialDate]);

  useEffect(() => {
    if (!formValues.boardingTime) return;

    const [hours, minutes] = formValues.boardingTime.split(":").map(Number);
    const boardingDate = new Date(selectedDate);
    boardingDate.setHours(hours);
    boardingDate.setMinutes(minutes);
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
