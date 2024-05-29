// src/App.js
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Alert } from "react-bootstrap";
import FlightForm from "./FlightForm";
import { Routes, Route } from "react-router-dom";
import "./App.css"; // Import the new CSS file

function App() {
  const [leaveTime, setLeaveTime] = useState("");

  const handleCalculate = (leaveTimeString) => {
    setLeaveTime(`You should leave at: ${leaveTimeString}`);
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col xs={12} className="text-center">
          <h1>What time should I leave for the airport?</h1>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={12}>
          <div className="border p-4 rounded shadow-sm bg-light">
            <Routes>
              <Route
                path="/"
                element={<FlightForm onCalculate={handleCalculate} />}
              />
            </Routes>
            {leaveTime && (
              <Alert variant="info" className="text-center mt-3">
                {leaveTime}
              </Alert>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
