import React from "react";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FlightFormInputs = ({
  formValues,
  handleFieldChange,
  selectedDate,
  handleDateChange,
  boardingTime,
}) => {
  return (
    <Form>
      <Form.Group>
        <Form.Label htmlFor="departureTime">Departure Time:</Form.Label>
        <Form.Control
          type="time"
          id="departureTime"
          value={formValues.departureTime}
          onChange={handleFieldChange("departureTime")}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor="boardingTime">Boarding Time:</Form.Label>
        <Form.Control
          type="time"
          id="boardingTime"
          value={boardingTime} // Boarding time is derived from departure time
          readOnly
        />
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor="drivingTime">
          Driving Time to Airport (minutes):
        </Form.Label>
        <Form.Control
          type="number"
          id="drivingTime"
          value={formValues.drivingTime}
          onChange={handleFieldChange("drivingTime")}
          style={{ width: "70px" }}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor="arriveEarly">
          Arrive how soon before boarding? (minutes):
        </Form.Label>
        <Form.Control
          type="number"
          id="arriveEarly"
          value={formValues.arriveEarly}
          onChange={handleFieldChange("arriveEarly")}
          style={{ width: "70px" }}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor="snackTime">Time For Snacks? (minutes):</Form.Label>
        <Form.Control
          type="number"
          id="snackTime"
          value={formValues.snackTime}
          onChange={handleFieldChange("snackTime")}
          style={{ width: "70px" }}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Departure Date:</Form.Label>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
          className="form-control"
        />
      </Form.Group>
    </Form>
  );
};

export default FlightFormInputs;
