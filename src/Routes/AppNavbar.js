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
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
