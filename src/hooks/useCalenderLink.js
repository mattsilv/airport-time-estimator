import { useCallback, useMemo } from "react";
import { isValid } from "date-fns";
import { formatDateTime, parseTimeString } from "../utils/timeUtils";
import { parseDate } from "../utils/dateUtils";

export function useCalenderLink(leaveTime, selectedDate) {
  const makeGoogleCalenderLink = useCallback((date) => {
    const start = formatDateTime(date);
    const end = formatDateTime(new Date(date.getTime() + 3600000));

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: "Depart for Airport",
      dates: `${start}/${end}`,
      details:
        "Time to leave for the airport. Created by https://airportcalc.silv.app/",
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

    return makeGoogleCalenderLink(leaveDate);
  }, [leaveTime, selectedDate, makeGoogleCalenderLink]);

  return { calendarURL };
}
