import {addDays, parseISO} from 'date-fns';

export const getDefaultDate = (location) => {
  const params = new URLSearchParams(location.search);
  const dateParam = params.get('date');
  const defaultDate = addDays(new Date(), 1);

  if (dateParam) {
    const date = parseISO(dateParam);
    return date < new Date() ? defaultDate : date;
  }
  return defaultDate;
};

export function parseSelectedDate(date) {
  return typeof selectedDate === 'string' ? parseISO(date) : new Date(date);
}
