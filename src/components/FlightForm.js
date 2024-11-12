import React from "react";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./FlightForm.module.css";
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
    <Form>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="anxietyLevel" className={styles.formLabel}>
          Travel Anxiety Slider:
        </Form.Label>
        <div className={styles.sliderContainer}>
          <Form.Range
            id="anxietyLevel"
            min="0"
            max="10"
            value={anxietyLevel}
            onChange={(e) => onAnxietyChange(parseInt(e.target.value))}
            className={styles.sliderThumb}
          />
          <div
            className={styles.sliderEmoji}
            style={{
              "--slider-percent": anxietyLevel / 10,
              marginLeft: "16px",
            }}
          >
            {getEmoji(anxietyLevel)}
          </div>
        </div>
        <div className={styles.anxietyText}>
          {getAnxietyText(anxietyLevel, extraMinutes)}
        </div>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="boardingTime" className={styles.formLabel}>
          Boarding Time:
        </Form.Label>
        <Form.Control
          type="time"
          id="boardingTime"
          value={formValues.boardingTime}
          onChange={onFieldChange("boardingTime")}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="drivingTime" className={styles.formLabel}>
          Travel Time to Airport (min.):
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
            className={`form-control-sm ${styles.numberControl}`}
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
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="arriveEarly" className={styles.formLabel}>
          Arrive how soon before boarding? (min.):
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
            className={`form-control-sm ${styles.numberControl}`}
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
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="selectedDate" className={styles.formLabel}>
          Departure Date:
        </Form.Label>
        <DatePicker
          selected={selectedDate}
          onChange={onDateChange}
          dateFormat="yyyy-MM-dd"
          className="form-control mx-2"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Check
          type="checkbox"
          id="internationalFlight"
          label="International Flight (+40 min)"
          checked={formValues.isInternational || false}
          onChange={(e) =>
            onCheckboxChange("isInternational", e.target.checked)
          }
        />
        <Form.Check
          type="checkbox"
          id="noTSAPre"
          label="No TSA Pre ✓ (+15 min)"
          checked={formValues.noTSAPre || false}
          onChange={(e) => onCheckboxChange("noTSAPre", e.target.checked)}
        />
        <Form.Check
          type="checkbox"
          id="needSnacks"
          label="Time for Snacks (+10 min)"
          checked={formValues.needSnacks || false}
          onChange={(e) => onCheckboxChange("needSnacks", e.target.checked)}
        />
      </Form.Group>
    </Form>
  );
};
