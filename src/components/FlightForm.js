import React from 'react';
import {Form} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const FlightForm = ({
  formValues,
  selectedDate,
  boardingTime,
  onFieldChange,
  onDateChange,
}) => {
  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="departureTime">Departure Time:</Form.Label>
        <Form.Control
          type="time"
          id="departureTime"
          value={formValues.departureTime}
          onChange={onFieldChange('departureTime')}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="boardingTime">Boarding Time:</Form.Label>
        <Form.Control
          type="time"
          id="boardingTime"
          value={boardingTime}
          disabled
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
          onChange={onFieldChange('drivingTime')}
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
          onChange={onFieldChange('arriveEarly')}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="snackTime">Time For Snacks? (minutes):</Form.Label>
        <Form.Control
          type="number"
          id="snackTime"
          value={formValues.snackTime}
          onChange={onFieldChange('snackTime')}
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
