import {useEffect, useState, useCallback} from 'react';
import {formatDateTime, parseTimeString} from '../utils/timeUtils';
import {parseISO, isValid} from 'date-fns';

function useCalenderLink(leaveTime, selectedDate) {
  const [calendarLink, setCalendarLink] = useState('');

  const createGoogleCalendarLink = useCallback(() => {
    if (!leaveTime) {
      console.error('Invalid leave time: leaveTime is empty or undefined');
      return;
    }

    const {hours, minutes} = parseTimeString(leaveTime);

    if (isNaN(hours) || isNaN(minutes)) {
      console.error(`Invalid leave time: ${leaveTime}`);
      return;
    }

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

    leaveDate.setHours(hours);
    leaveDate.setMinutes(minutes);

    const formattedStart = formatDateTime(leaveDate);
    const formattedEnd = formatDateTime(
      new Date(leaveDate.getTime() + 3600000)
    ); // Add one hour for the end time

    const baseURL = 'https://www.google.com/calendar/render';
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: 'Depart for Airport',
      dates: `${formattedStart}/${formattedEnd}`,
      details:
        'Time to leave for the airport. Created by https://airportcalc.silv.app/',
    });

    const calendarURL = `${baseURL}?${params.toString()}`;
    setCalendarLink(calendarURL);
    console.log('Calendar link created:', calendarURL);
  }, [leaveTime, selectedDate]);

  useEffect(() => {
    createGoogleCalendarLink();
  }, [createGoogleCalendarLink]);

  return calendarLink;
}

export default useCalenderLink;
