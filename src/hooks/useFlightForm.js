import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAfter } from "date-fns";
import { calculateTimeline } from "../utils/timelineUtils";
import { useFormState } from "./useFormState";

export function useFlightForm() {
  const navigate = useNavigate();

  const [leaveTime, setLeaveTime] = useState(null);

  const {
    formValues,
    selectedDate,
    handleFieldChange,
    setSelectedDate,
    resetFields,
    setIsInitialLoad,
    setFormValues,
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
    navigate("/", { replace: true });
    console.log("Reset button clicked, URL and state reset");
  };

  const handleAnxietyChange = (level) => {
    setFormValues((prev) => ({
      ...prev,
      anxietyLevel: level,
    }));
  };

  const handleCheckboxChange = (name, checked) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleAirportSelect = (data) => {
    console.log("handleAirportSelect received:", data);

    setFormValues((prev) => {
      const newValues = {
        ...prev,
        airport: data.airport
          ? {
              code: data.airport.code,
              display: data.airport.display,
              lat: data.airport.lat,
              long: data.airport.long,
            }
          : null,
        routeInfo: data.routeInfo
          ? {
              distance: data.routeInfo.distance || 0,
              duration: data.routeInfo.duration || 0,
              travelTimeMinutes: data.routeInfo.travelTimeMinutes || 0,
            }
          : null,
        userLocation: data.userLocation || prev.userLocation,
        drivingTime: data.routeInfo
          ? Math.ceil(data.routeInfo.travelTimeMinutes || 0).toString()
          : prev.drivingTime,
      };

      console.log("Updated form values:", newValues);
      return newValues;
    });
  };

  useEffect(() => {
    if (!formValues.boardingTime) {
      console.log("Boarding time is not set yet.");
      return;
    }

    // Use timeline calculation for accurate leave time
    const timeline = calculateTimeline(formValues, formValues.routeInfo, selectedDate);
    
    if (timeline.totals?.leaveTime) {
      setLeaveTime(timeline.totals.leaveTime);
      console.log(`Calculated leave time via timeline: ${timeline.totals.leaveTime}`);
    }
  }, [formValues, selectedDate]);

  return {
    formValues,
    selectedDate,
    leaveTime,
    handleFieldChange,
    handleDateChange,
    handleReset,
    handleAnxietyChange,
    handleCheckboxChange,
    handleAirportSelect,
  };
}
