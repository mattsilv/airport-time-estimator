import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Alert } from "react-bootstrap";
import FlightForm from "./FlightForm";

function App() {
  const [leaveTime, setLeaveTime] = useState("");

  const handleCalculate = (boardingTime, totalMinutes) => {
    const [boardingHours, boardingMinutes] = boardingTime
      .split(":")
      .map(Number);
    const boardingDate = new Date();
    boardingDate.setHours(boardingHours);
    boardingDate.setMinutes(boardingMinutes - totalMinutes);
    const hours = boardingDate.getHours();
    const minutes = boardingDate.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");
    setLeaveTime(`You should leave at: ${formattedHours}:${minutes} ${ampm}`);
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
            <FlightForm onCalculate={handleCalculate} />
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
