import React from "react";
import { Form } from "react-bootstrap";
import styles from "../styles/Form.module.css";
import { InfoTooltip } from "./InfoTooltip";

const CHECKBOX_CONFIG = [
  {
    id: "internationalFlight",
    label: "Int'l Flight (+40m)",
    name: "isInternational",
  },
  {
    id: "noTSAPre",
    label: "No TSA Pre ✓ (+15m)",
    name: "noTSAPre",
  },
  {
    id: "needSnacks",
    label: "Snacks (+10m)",
    name: "needSnacks",
    tooltip: "There's probably no good food on the plane.",
  },
  {
    id: "needParking",
    label: "Parking car (+15m)",
    name: "needParking",
  },
  {
    id: "withKids",
    label: "Kids? (+15%)",
    name: "withKids",
    tooltip: "Preemptively adds 15% to total travel time for gremlin attacks",
  },
  {
    id: "tsaArgument",
    label: "TSA Pre✓ debate (+3m)",
    name: "tsaArgument",
    tooltip:
      "Allocated time to debate why your significant other does not have TSA Pre✓ yet",
  },
];

export const FlightCheckboxes = ({ formValues, onCheckboxChange }) => {
  return (
    <div className={styles.formGroup}>
      <div className={styles.checkboxGrid}>
        {CHECKBOX_CONFIG.map(({ id, label, name, tooltip }) => (
          <div key={id} className={styles.checkboxContainer}>
            <Form.Check
              className={styles.checkboxLabel}
              type="checkbox"
              id={id}
              label={label}
              checked={Boolean(formValues[name])}
              onChange={(e) => onCheckboxChange(name, e.target.checked)}
            />
            {tooltip && <InfoTooltip text={tooltip} />}
          </div>
        ))}
      </div>
    </div>
  );
};
