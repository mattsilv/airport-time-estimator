// src/components/FlightFormInputs.js
import React from "react";
import { Form, Button } from "react-bootstrap";
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
      <Form.Group className="mb-3">
        <Form.Label htmlFor="departureTime">Departure Time:</Form.Label>
        <Form.Control
          type="time"
          id="departureTime"
          value={formValues.departureTime}
          onChange={handleFieldChange("departureTime")}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="boardingTime">Boarding Time:</Form.Label>
        <Form.Control
          type="time"
          id="boardingTime"
          value={boardingTime}
          readOnly
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
          onChange={handleFieldChange("drivingTime")}
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
          onChange={handleFieldChange("arriveEarly")}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="snackTime">Time For Snacks? (minutes):</Form.Label>
        <Form.Control
          type="number"
          id="snackTime"
          value={formValues.snackTime}
          onChange={handleFieldChange("snackTime")}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Departure Date:</Form.Label>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
          className="form-control"
        />
      </Form.Group>
      <Button variant="primary" type="submit" className="w-100">
        Calculate
      </Button>
    </Form>
  );
};

export default FlightFormInputs;
