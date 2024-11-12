import { Container, Navbar } from "react-bootstrap";
import styles from "../styles/Navbar.module.css";

export function AppNavbar() {
  return (
    <Navbar expand="lg" className={`bg-light ${styles.navbar}`}>
      <Container>
        <Navbar.Brand href="/" className={styles.brand}>
          <img
            alt=""
            src="./favicon-32x32.png"
            width="30"
            height="30"
            className={`d-inline-block align-top ${styles.logo}`}
          />
          Airport ETA Calculator
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}
