import { Container, Navbar } from "react-bootstrap";
import { ThemeToggle } from "../components/ThemeToggle";
import styles from "../styles/Navbar.module.css";

export function AppNavbar() {
  return (
    <Navbar
      expand="lg"
      className={styles.navbar}
      style={{
        backgroundColor: "var(--bg-primary)",
      }}
    >
      <Container className="d-flex justify-content-between align-items-center">
        <Navbar.Brand
          href="/"
          className={styles.brand}
          style={{
            color: "var(--text-primary)",
          }}
        >
          <img
            alt=""
            src="./favicon-32x32.png"
            width="30"
            height="30"
            className={styles.logo}
          />
          Airport ETA Calculator
        </Navbar.Brand>
        <ThemeToggle />
      </Container>
    </Navbar>
  );
}
