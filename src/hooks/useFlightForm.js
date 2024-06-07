import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {parseISO, isValid, isAfter} from 'date-fns';
import {formatTime, parseTimeString} from '../utils/timeUtils';
import {useFormState} from './useFormState';

export function useFlightForm() {
  const navigate = useNavigate();

  const [leaveTime, setLeaveTime] = useState(null);

  const {
    formValues,
    selectedDate,
    boardingTime,
    handleFieldChange,
    setSelectedDate,
    setBoardingTime,
    resetFields,
    setIsInitialLoad,
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
    setBoardingTime('');
    navigate('/', {replace: true});
    console.log('Reset button clicked, URL and state reset');
  };

  useEffect(() => {
    if (!boardingTime) {
      console.log('Boarding time is not set yet.');
      return;
    }

    const {hours: boardingHours, minutes: boardingMinutes} =
      parseTimeString(boardingTime);
    const {drivingTime, arriveEarly, snackTime} = formValues;
    const totalMinutes =
      parseInt(drivingTime || 0, 10) +
      parseInt(arriveEarly || 0, 10) +
      parseInt(snackTime || 0, 10);

    let leaveDate;
    if (typeof selectedDate === 'string') {
      leaveDate = parseISO(selectedDate);
      if (!isValid(leaveDate)) {
        console.error('Invalid leave date:', leaveDate);
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
  }, [formValues, boardingTime, selectedDate]);

  return {
    formValues,
    selectedDate,
    boardingTime,
    leaveTime,
    handleFieldChange,
    handleDateChange,
    handleReset,
  };
}
