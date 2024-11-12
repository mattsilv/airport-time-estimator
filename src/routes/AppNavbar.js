import { Container, Navbar } from "react-bootstrap";

export function AppNavbar() {
  return (
    <Navbar
      expand="lg"
      className="bg-light"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        marginBottom: "-1rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <Container>
        <Navbar.Brand href="/" className="py-2">
          <img
            alt=""
            src="./favicon-32x32.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          Airport ETA Calculator
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}
