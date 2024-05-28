import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";

function App() {
  const [departureTime, setDepartureTime] = useState("");
  const [boardingTime, setBoardingTime] = useState("");
  const [drivingTime, setDrivingTime] = useState("");
  const [arriveEarly, setArriveEarly] = useState("");
  const [snackTime, setSnackTime] = useState("");
  const [leaveTime, setLeaveTime] = useState("");

  useEffect(() => {
    if (departureTime) {
      const [hours, minutes] = departureTime.split(":").map(Number);
      const boardingDate = new Date();
      boardingDate.setHours(hours);
      boardingDate.setMinutes(minutes - 30);
      setBoardingTime(boardingDate.toTimeString().substring(0, 5));
    }
  }, [departureTime]);

  const handleDepartureChange = (e) => {
    setDepartureTime(e.target.value);
  };

  const calculateLeaveTime = (e) => {
    e.preventDefault();
    const totalMinutes =
      parseInt(drivingTime, 10) +
      parseInt(arriveEarly, 10) +
      parseInt(snackTime, 10);
    const [boardingHours, boardingMinutes] = boardingTime
      .split(":")
      .map(Number);
    const boardingDate = new Date();
    boardingDate.setHours(boardingHours);
    boardingDate.setMinutes(boardingMinutes - totalMinutes);
    const hours = boardingDate.getHours().toString().padStart(2, "0");
    const minutes = boardingDate.getMinutes().toString().padStart(2, "0");
    setLeaveTime(`You should leave at: ${hours}:${minutes}`);
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <div className="border p-4 rounded shadow-sm bg-light">
            <Form onSubmit={calculateLeaveTime}>
              <Form.Group>
                <Form.Label htmlFor="departure-time">
                  Departure Time:
                </Form.Label>
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
                  onChange={(e) => setDrivingTime(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="arrive-early">
                  Arrive Early (minutes):
                </Form.Label>
                <Form.Control
                  type="number"
                  id="arrive-early"
                  value={arriveEarly}
                  onChange={(e) => setArriveEarly(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="snack-time">
                  Snack Time (minutes):
                </Form.Label>
                <Form.Control
                  type="number"
                  id="snack-time"
                  value={snackTime}
                  onChange={(e) => setSnackTime(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" type="submit" block>
                Calculate
              </Button>
            </Form>
            {leaveTime && (
              <Alert
                variant="info"
                className="text-center mt-3 font-weight-bold"
              >
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
