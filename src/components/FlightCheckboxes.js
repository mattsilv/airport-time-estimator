import React from "react";
import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import styles from "../styles/Form.module.css";

export const FlightCheckboxes = ({ formValues, onCheckboxChange }) => {
  const renderTooltip = (props) => (
    <Tooltip id="tsa-debate-tooltip" {...props}>
      Allocated time to debate why your significant other does not have TSA Pre✓
      yet
    </Tooltip>
  );

  return (
    <div className={styles.formGroup}>
      <Form.Check
        className={styles.checkboxLabel}
        type="checkbox"
        id="internationalFlight"
        label="International Flight (+40 min)"
        checked={Boolean(formValues.isInternational)}
        onChange={(e) => onCheckboxChange("isInternational", e.target.checked)}
      />
      <Form.Check
        className={styles.checkboxLabel}
        type="checkbox"
        id="noTSAPre"
        label="No TSA Pre ✓ (+15 min)"
        checked={Boolean(formValues.noTSAPre)}
        onChange={(e) => onCheckboxChange("noTSAPre", e.target.checked)}
      />
      <Form.Check
        className={styles.checkboxLabel}
        type="checkbox"
        id="needSnacks"
        label="Time for Snacks (+10 min)"
        checked={Boolean(formValues.needSnacks)}
        onChange={(e) => onCheckboxChange("needSnacks", e.target.checked)}
      />
      <Form.Check
        className={styles.checkboxLabel}
        type="checkbox"
        id="needParking"
        label="Parking car (+15 min)"
        checked={Boolean(formValues.needParking)}
        onChange={(e) => onCheckboxChange("needParking", e.target.checked)}
      />
      <div className={styles.checkboxContainer}>
        <Form.Check
          className={styles.checkboxLabel}
          type="checkbox"
          id="tsaArgument"
          label="TSA Pre✓ debate (+3 min)"
          checked={Boolean(formValues.tsaArgument)}
          onChange={(e) => onCheckboxChange("tsaArgument", e.target.checked)}
        />
        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip}
        >
          <span className={styles.infoIcon}>ⓘ</span>
        </OverlayTrigger>
      </div>
    </div>
  );
};
