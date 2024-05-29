import React from "react";
import { Form } from "react-bootstrap";

const TimeInput = ({ label, value, onChange, readOnly = false }) => (
  <Form.Group>
    <Form.Label>{label}</Form.Label>
    <Form.Control
      type="time"
      value={value}
      onChange={onChange}
      readOnly={readOnly}
    />
  </Form.Group>
);

export default TimeInput;
