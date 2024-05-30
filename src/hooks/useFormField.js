import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { parseISO, isValid } from "date-fns"; // Import parseISO and isValid

function useFormField(name, defaultValue) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const [value, setValue] = useState(params.get(name) || defaultValue);
  const [isDefault, setIsDefault] = useState(!params.get(name));

  useEffect(() => {
    if (!isDefault) {
      const searchParams = new URLSearchParams(location.search);
      const parsedValue = parseISO(value);
      if (isValid(parsedValue)) {
        searchParams.set(name, parsedValue.toISOString());
        navigate({ search: searchParams.toString() });
      }
    }
  }, [name, value, isDefault, navigate, location.search]);

  const handleChange = (e) => {
    setValue(e.target.value);
    setIsDefault(false);
  };

  const handleReset = () => {
    setValue(defaultValue);
    setIsDefault(true);
  };

  return { value, isDefault, handleChange, handleReset };
}

export default useFormField;
