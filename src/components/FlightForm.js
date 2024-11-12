import React from "react";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const anxietyLevels = {
  0: "Cool as a cucumber 🥒",
  1: "I like a little buffer 😮‍💨",
  2: "Hope TSA doesn't shout at me 🤬",
  3: "What if my Uber cancels twice? 🚗",
  4: "Did I pack my ID? 🔍",
  5: "Security line looking mighty long 〰️",
  6: "I want to hear the announcements 📢",
  7: "Please don't give my seat away 💺",
  8: "Running through terminal in socks 🧦",
  9: "Watching my connection take off 🛬",
  10: "WHY AM I DOING THIS 😱",
};

export const FlightForm = ({
  formValues,
  selectedDate,
  onFieldChange,
  onDateChange,
  onAnxietyChange,
  onCheckboxChange,
}) => {
  const getAnxietyText = (level) => {
    const extraMinutes = level * 5;
    return `${anxietyLevels[level]} (+${extraMinutes} min)`;
  };

  const getSliderColor = (level) => {
    const red = Math.round((level / 10) * 255);
    const green = Math.round(((10 - level) / 10) * 128 + 50);
    return `rgb(${red}, ${green}, 0)`;
  };

  const sliderColor = getSliderColor(formValues.anxietyLevel || 0);

  return (
    <Form>
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

      <Form.Group className="mb-3">
        <Form.Label htmlFor="anxietyLevel">Travel Anxiety:</Form.Label>
        <Form.Range
          id="anxietyLevel"
          min="0"
          max="10"
          value={formValues.anxietyLevel || 0}
          onChange={(e) => onAnxietyChange(parseInt(e.target.value))}
          style={{
            touchAction: "none",
            userSelect: "none",
            WebkitUserSelect: "none",
          }}
        />
        <style>
          {`
            #anxietyLevel::-webkit-slider-thumb {
              background: ${sliderColor} !important;
            }
            #anxietyLevel::-moz-range-thumb {
              background: ${sliderColor} !important;
            }
            #anxietyLevel::-ms-thumb {
              background: ${sliderColor} !important;
            }
          `}
        </style>
        <div style={{ textAlign: "left" }}>
          {getAnxietyText(formValues.anxietyLevel || 0)}
        </div>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="boardingTime">Boarding Time:</Form.Label>
        <Form.Control
          type="time"
          id="boardingTime"
          value={formValues.boardingTime}
          onChange={onFieldChange("boardingTime")}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="drivingTime">
          Driving Time to Airport (minutes):
        </Form.Label>
        <Form.Control
          type="number"
          id="drivingTime"
          value={formValues.drivingTime}
          onChange={onFieldChange("drivingTime")}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="arriveEarly">
          Arrive how soon before boarding? (minutes):
        </Form.Label>
        <Form.Control
          type="number"
          id="arriveEarly"
          value={formValues.arriveEarly}
          onChange={onFieldChange("arriveEarly")}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="selectedDate">Departure Date:</Form.Label>
        <DatePicker
          selected={selectedDate}
          onChange={onDateChange}
          dateFormat="yyyy-MM-dd"
          className="form-control mx-2"
        />
      </Form.Group>
    </Form>
  );
};
