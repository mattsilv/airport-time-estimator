import {Container, Navbar} from 'react-bootstrap';

function AppNavbar() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">
          {' '}
          <img
            alt=""
            src="./favicon-32x32.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
          Airport Time Calculator
        </Navbar.Brand>
        {/* <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
          </Nav>
        </Navbar.Collapse> */}
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
