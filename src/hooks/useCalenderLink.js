import {useCallback} from 'react';
import {formatDateTime, parseTimeString} from '../utils/timeUtils';
import {parseISO, isValid} from 'date-fns';

export function useCalenderLink() {
  const createGoogleCalendarLink = useCallback((leaveTime, selectedDate) => {
    const {hours, minutes} = parseTimeString(leaveTime);
    if (isNaN(hours) || isNaN(minutes)) {
      console.error(`Invalid leave time: ${leaveTime}`);
      return;
    }

    const leaveDate = parseSelectedDate(selectedDate);
    if (!isValid(leaveDate)) {
      console.error('Invalid leave date:', leaveDate);
      return;
    }

    leaveDate.setHours(hours);
    leaveDate.setMinutes(minutes);

    const calendarURL = makeGoogleCalenderLink(leaveDate);
    console.log('Calendar link created:', calendarURL);
    return calendarURL;
  }, []);

  return {createGoogleCalendarLink};
}

function parseSelectedDate(date) {
  return typeof selectedDate === 'string' ? parseISO(date) : new Date(date);
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
