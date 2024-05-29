import { format, addDays } from "date-fns";

export const formatDateTime = (date) => {
  return format(date, "yyyyMMdd'T'HHmmss");
};

export const getDefaultDate = (location) => {
  const params = new URLSearchParams(location.search);
  const dateParam = params.get("date");
  const defaultDate = addDays(new Date(), 1);

  if (dateParam) {
    const date = new Date(dateParam);
    return date < new Date() ? defaultDate : date;
  }
  return defaultDate;
};
