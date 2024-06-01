import {useState, useEffect} from 'react';
import {formatInputTime} from '../utils/timeUtils';
import {parseISO, isValid} from 'date-fns';

const useFormState = (formFieldsConfig, defaultDate) => {
  const [formValues, setFormValues] = useState(() =>
    formFieldsConfig.reduce((acc, field) => {
      const params = new URLSearchParams(window.location.search);
      acc[field.name] = params.get(field.name) || field.defaultValue;
      return acc;
    }, {})
  );

  const initialDate =
    typeof defaultDate === 'string'
      ? parseISO(defaultDate)
      : new Date(defaultDate);
  const [selectedDate, setSelectedDate] = useState(
    isValid(initialDate) ? initialDate : new Date()
  );
  const [boardingTime, setBoardingTime] = useState('');
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
    setSelectedDate(isValid(initialDate) ? initialDate : new Date());
    setIsInitialLoad(true);
  };

  useEffect(() => {
    if (isInitialLoad) {
      const [hours, minutes] = formValues.departureTime.split(':').map(Number);
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
