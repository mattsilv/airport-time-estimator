import { addDays, parseISO } from "date-fns"; // Import necessary functions

export const getDefaultDate = (location) => {
  const params = new URLSearchParams(location.search);
  const dateParam = params.get("date");
  const defaultDate = addDays(new Date(), 1);

  if (dateParam) {
    const date = parseISO(dateParam); // Use parseISO for consistent parsing
    return date < new Date() ? defaultDate : date;
  }
  return defaultDate;
};
