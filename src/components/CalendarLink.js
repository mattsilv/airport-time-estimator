import React, { useEffect, useState, useCallback } from "react";
import { formatDateTime, parseTimeString } from "../utils/timeUtils";
import { parseISO, isValid } from "date-fns"; // Import parseISO and isValid

const CalendarLink = ({ leaveTime, selectedDate }) => {
  const [calendarLink, setCalendarLink] = useState("");

  const createGoogleCalendarLink = useCallback(() => {
    if (!leaveTime) {
      console.error("Invalid leave time: leaveTime is empty or undefined");
      return;
    }

    const { hours, minutes } = parseTimeString(leaveTime);

    if (isNaN(hours) || isNaN(minutes)) {
      console.error(`Invalid leave time: ${leaveTime}`);
      return;
    }

    let leaveDate;
    if (typeof selectedDate === "string") {
      leaveDate = parseISO(selectedDate);
      if (!isValid(leaveDate)) {
        console.error("Invalid leave date:", leaveDate);
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

    const baseURL = "https://www.google.com/calendar/render";
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: "Depart for Airport",
      dates: `${formattedStart}/${formattedEnd}`,
      details:
        "Time to leave for the airport. Created by https://airportcalc.silv.app/",
    });
    setCalendarLink(`${baseURL}?${params.toString()}`);
    console.log("Calendar link created:", `${baseURL}?${params.toString()}`);
  }, [leaveTime, selectedDate]);

  useEffect(() => {
    createGoogleCalendarLink();
  }, [leaveTime, selectedDate, createGoogleCalendarLink]);

  return (
    <div className="text-center mt-3">
      <a href={calendarLink} target="_blank" rel="noopener noreferrer">
        Add to Calendar
      </a>
    </div>
  );
};

export default CalendarLink;
