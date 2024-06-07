import {useEffect, useState} from 'react';
import {isValid} from 'date-fns';
import {formatDateTime, parseTimeString} from '../utils/timeUtils';
import {parseDate} from '../utils/dateUtils';

export function useCalenderLink(leaveTime, selectedDate) {
  const [calendarURL, setCalendarURL] = useState(null);

  useEffect(() => {
    if (!leaveTime) {
      return;
    }

    const {hours, minutes} = parseTimeString(leaveTime);
    if (isNaN(hours) || isNaN(minutes)) {
      console.error(`Invalid leave time: ${leaveTime}`);
      return;
    }

    const leaveDate = parseDate(selectedDate);
    if (!isValid(leaveDate)) {
      console.error('Invalid leave date:', leaveDate);
      return;
    }

    leaveDate.setHours(hours);
    leaveDate.setMinutes(minutes);

    const url = makeGoogleCalenderLink(leaveDate);
    console.log('Calendar link created:', url);
    setCalendarURL(url);
  }, [leaveTime, selectedDate]);

  return {calendarURL};
}

function makeGoogleCalenderLink(date) {
  const start = formatDateTime(date);
  const end = formatDateTime(new Date(date.getTime() + 3600000)); // Add one hour for the end time

  const baseURL = 'https://www.google.com/calendar/render';
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: 'Depart for Airport',
    dates: `${start}/${end}`,
    details:
      'Time to leave for the airport. Created by https://airportcalc.silv.app/',
  });
  return `${baseURL}?${params.toString()}`;
}
