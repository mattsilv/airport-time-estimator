// src/hooks/useFormField.js
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function useFormField(name, defaultValue) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const [value, setValue] = useState(params.get(name) || defaultValue);
  const [isDefault, setIsDefault] = useState(!params.get(name));

  useEffect(() => {
    if (!isDefault) {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set(name, value);
      navigate({ search: searchParams.toString() });
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
