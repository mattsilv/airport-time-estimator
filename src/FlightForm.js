// src/FlightForm.js
import React from "react";
import FlightFormLogic from "./FlightFormLogic";

const FlightForm = ({ onCalculate }) => {
  return <FlightFormLogic onCalculate={onCalculate} />;
};

export default FlightForm;
