// src/FlightFormInputs.js
import React from "react";
import { Form } from "react-bootstrap";

const FlightFormInputs = ({
  departureTime,
  boardingTime,
  drivingTime,
  arriveEarly,
  snackTime,
  handleDepartureChange,
  handleDrivingTimeChange,
  handleArriveEarlyChange,
  handleSnackTimeChange,
}) => {
  return (
    <Form>
      <Form.Group>
        <Form.Label htmlFor="departure-time">Departure Time:</Form.Label>
        <Form.Control
          type="time"
          id="departure-time"
          value={departureTime}
          onChange={handleDepartureChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor="boarding-time">Boarding Time:</Form.Label>
        <Form.Control
          type="time"
          id="boarding-time"
          value={boardingTime}
          readOnly
        />
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor="driving-time">
          Driving Time to Airport With Traffic (minutes):
        </Form.Label>
        <Form.Control
          type="number"
          id="driving-time"
          value={drivingTime}
          onChange={handleDrivingTimeChange}
          style={{ width: "70px" }}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor="arrive-early">Arrive Early (minutes):</Form.Label>
        <Form.Control
          type="number"
          id="arrive-early"
          value={arriveEarly}
          onChange={handleArriveEarlyChange}
          style={{ width: "70px" }}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor="snack-time">Snack Time (minutes):</Form.Label>
        <Form.Control
          type="number"
          id="snack-time"
          value={snackTime}
          onChange={handleSnackTimeChange}
          style={{ width: "70px" }}
        />
      </Form.Group>
    </Form>
  );
};

export default FlightFormInputs;
