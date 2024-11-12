import React from "react";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../styles/Form.module.css";
import sliderStyles from "../styles/Slider.module.css";
import { getAnxietyText, getEmoji } from "../config/anxietyConfig";

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
        <Form.Label className={styles.formLabel}>Travel Anxiety</Form.Label>
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
        <label className={styles.formLabel}>Boarding Time</label>
        <input
          type="time"
          id="boardingTime"
          value={formValues.boardingTime}
          onChange={onFieldChange("boardingTime")}
          className={styles.timeInput}
        />
      </div>

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
        <Form.Check
          className={styles.checkboxLabel}
          type="checkbox"
          id="internationalFlight"
          label="International Flight (+40 min)"
          checked={formValues.isInternational || false}
          onChange={(e) =>
            onCheckboxChange("isInternational", e.target.checked)
          }
        />
        <Form.Check
          className={styles.checkboxLabel}
          type="checkbox"
          id="noTSAPre"
          label="No TSA Pre ✓ (+15 min)"
          checked={formValues.noTSAPre || false}
          onChange={(e) => onCheckboxChange("noTSAPre", e.target.checked)}
        />
        <Form.Check
          className={styles.checkboxLabel}
          type="checkbox"
          id="needSnacks"
          label="Time for Snacks (+10 min)"
          checked={formValues.needSnacks || false}
          onChange={(e) => onCheckboxChange("needSnacks", e.target.checked)}
        />
      </div>
    </Form>
  );
};
