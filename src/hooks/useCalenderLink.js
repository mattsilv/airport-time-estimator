import { useCallback, useMemo } from "react";
import { isValid } from "date-fns";
import { formatDateTime, parseTimeString } from "../utils/timeUtils";
import { parseDate } from "../utils/dateUtils";
import { 
  generateCalendarDescription, 
  generateCalendarTitle, 
  getCalendarLocation 
} from "../utils/calendarUtils";

export function useCalenderLink(leaveTime, selectedDate, formValues = {}, routeInfo = {}) {
  const makeGoogleCalenderLink = useCallback((date, formValues, routeInfo) => {
    const start = formatDateTime(date);
    const end = formatDateTime(new Date(date.getTime() + 3600000));

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: generateCalendarTitle(formValues),
      dates: `${start}/${end}`,
      location: getCalendarLocation(formValues),
      details: generateCalendarDescription(formValues, routeInfo),
    });
    return `https://www.google.com/calendar/render?${params.toString()}`;
  }, []);

  const calendarURL = useMemo(() => {
    if (!leaveTime) return null;

    const { hours, minutes } = parseTimeString(leaveTime);
    if (isNaN(hours) || isNaN(minutes)) return null;

    const leaveDate = parseDate(selectedDate);
    if (!isValid(leaveDate)) return null;

    leaveDate.setHours(hours);
    leaveDate.setMinutes(minutes);

    return makeGoogleCalenderLink(leaveDate, formValues, routeInfo);
  }, [leaveTime, selectedDate, formValues, routeInfo, makeGoogleCalenderLink]);

  return { calendarURL };
}
