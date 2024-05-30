import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { parseISO, isValid } from "date-fns"; // Import parseISO and isValid

const useUrlParams = (
  formValues,
  selectedDate,
  isInitialLoad,
  formFieldsConfig,
  defaultDate
) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paramsUpdated, setParamsUpdated] = useState(false);

  useEffect(() => {
    if (!isInitialLoad && !paramsUpdated) {
      const params = new URLSearchParams(location.search);
      let shouldNavigate = false;

      Object.entries(formValues).forEach(([key, value]) => {
        const defaultValue = formFieldsConfig.find(
          (field) => field.name === key
        ).defaultValue;
        if (value !== defaultValue) {
          if (params.get(key) !== value) {
            params.set(key, value);
            shouldNavigate = true;
          }
        } else if (params.has(key)) {
          params.delete(key);
          shouldNavigate = true;
        }
      });

      let parsedDate;
      if (typeof selectedDate === "string") {
        parsedDate = parseISO(selectedDate);
      } else {
        parsedDate = new Date(selectedDate);
      }

      if (isValid(parsedDate)) {
        const formattedDate = parsedDate.toISOString().split("T")[0];
        if (formattedDate !== defaultDate.toISOString().split("T")[0]) {
          if (params.get("date") !== formattedDate) {
            params.set("date", formattedDate);
            shouldNavigate = true;
          }
        } else if (params.has("date")) {
          params.delete("date");
          shouldNavigate = true;
        }
      }

      if (shouldNavigate) {
        setParamsUpdated(true); // Prevent immediate re-update
        navigate({ search: params.toString() }, { replace: true });
      }
    }
  }, [
    formValues,
    selectedDate,
    isInitialLoad,
    formFieldsConfig,
    defaultDate,
    location.search,
    navigate,
    paramsUpdated,
  ]);

  // Reset paramsUpdated after some time to allow further updates
  useEffect(() => {
    if (paramsUpdated) {
      const timer = setTimeout(() => setParamsUpdated(false), 300); // Adjust the delay as necessary
      return () => clearTimeout(timer);
    }
  }, [paramsUpdated]);
};

export default useUrlParams;
