import React from "react";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../styles/Form.module.css";
import sliderStyles from "../styles/Slider.module.css";
import { getAnxietyText, getEmoji } from "../config/anxietyConfig";
import { FlightCheckboxes } from "./FlightCheckboxes";
import { InfoTooltip } from "./InfoTooltip";

export const FlightForm = ({
  formValues,
  selectedDate,
  onFieldChange,
  onDateChange,
  onAnxietyChange,
  onCheckboxChange,
}) => {
  const handleNumberChange = (fieldName) => (e) => {
    const value = Math.max(0, Math.min(999, parseInt(e.target.value) || 0));
    onFieldChange(fieldName)({ target: { value: value.toString() } });
  };

  const anxietyLevel = formValues.anxietyLevel || 0;
  const extraMinutes = anxietyLevel * 5;

  return (
    <Form className={styles.sliderForm}>
      <div className={styles.formGroup}>
        <div className={styles.labelContainer}>
          <Form.Label className={styles.formLabel}>
            Travel Anxiety Slider
          </Form.Label>
          <InfoTooltip text="Adds 5 minutes of buffer time for each level of anxiety" />
        </div>
        <div className={sliderStyles.sliderContainer}>
          <div className={sliderStyles.sliderTrack} />
          <input
            type="range"
            min="0"
            max="10"
            value={anxietyLevel}
            onChange={(e) => onAnxietyChange(parseInt(e.target.value))}
            className={sliderStyles.sliderInput}
          />
          <div
            className={sliderStyles.sliderEmoji}
            style={{
              "--slider-percent": anxietyLevel / 10,
            }}
          >
            {getEmoji(anxietyLevel)}
          </div>
        </div>
        <div className={sliderStyles.anxietyText}>
          {getAnxietyText(anxietyLevel, extraMinutes)}
        </div>
      </div>

      <div className={styles.formGroup}>
        <Form.Label className={styles.formLabel}>
          Travel Time to Airport
        </Form.Label>
        <div className="d-flex align-items-center">
          <Form.Control
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            id="drivingTime"
            value={formValues.drivingTime}
            onChange={handleNumberChange("drivingTime")}
            min="0"
            max="999"
            className={styles.numberControl}
          />
          <div className="d-flex gap-2 ms-2">
            <button
              type="button"
              className={`btn rounded-circle d-flex align-items-center justify-content-center ${styles.decrementButton}`}
              onClick={() =>
                handleNumberChange("drivingTime")({
                  target: {
                    value: (parseInt(formValues.drivingTime) - 5).toString(),
                  },
                })
              }
            >
              −
            </button>
            <button
              type="button"
              className={`btn rounded-circle d-flex align-items-center justify-content-center ${styles.incrementButton}`}
              onClick={() =>
                handleNumberChange("drivingTime")({
                  target: {
                    value: (parseInt(formValues.drivingTime) + 5).toString(),
                  },
                })
              }
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className={styles.formGroup}>
        <Form.Label className={styles.formLabel}>
          Buffer Time Before Boarding
        </Form.Label>
        <div className="d-flex align-items-center">
          <Form.Control
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            id="arriveEarly"
            value={formValues.arriveEarly}
            onChange={handleNumberChange("arriveEarly")}
            min="0"
            max="999"
            className={styles.numberControl}
          />
          <div className="d-flex gap-2 ms-2">
            <button
              type="button"
              className={`btn rounded-circle d-flex align-items-center justify-content-center ${styles.decrementButton}`}
              onClick={() =>
                handleNumberChange("arriveEarly")({
                  target: {
                    value: (parseInt(formValues.arriveEarly) - 5).toString(),
                  },
                })
              }
            >
              −
            </button>
            <button
              type="button"
              className={`btn rounded-circle d-flex align-items-center justify-content-center ${styles.incrementButton}`}
              onClick={() =>
                handleNumberChange("arriveEarly")({
                  target: {
                    value: (parseInt(formValues.arriveEarly) + 5).toString(),
                  },
                })
              }
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Boarding Time</label>
        <input
          type="time"
          id="boardingTime"
          value={formValues.boardingTime}
          onChange={onFieldChange("boardingTime")}
          className={styles.timeInput}
        />
      </div>

      <FlightCheckboxes
        formValues={formValues}
        onCheckboxChange={onCheckboxChange}
      />

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Departure Date</label>
        <div className={styles.dateInputWrapper}>
          <DatePicker
            selected={selectedDate}
            onChange={onDateChange}
            dateFormat="yyyy-MM-dd"
            className={styles.dateInput}
          />
        </div>
      </div>
    </Form>
  );
};
