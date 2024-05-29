import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Alert } from "react-bootstrap";
import FlightForm from "./FlightForm";
import { Routes, Route } from "react-router-dom";

function App() {
  const [leaveTime, setLeaveTime] = useState("");

  const handleCalculate = (leaveTimeString) => {
    console.log("Setting leave time:", leaveTimeString); // Debug
    setLeaveTime(`You should leave at: ${leaveTimeString}`);
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={5} className="text-center">
          <h1>What time should I leave for the airport?</h1>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <div className="border p-4 rounded shadow-sm bg-light">
            <Routes>
              <Route
                path="/"
                element={<FlightForm onCalculate={handleCalculate} />}
              />
            </Routes>
            {leaveTime && (
              <div>
                <Alert
                  variant="info"
                  className="text-center mt-3 font-weight-bold"
                >
                  {leaveTime}
                </Alert>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
