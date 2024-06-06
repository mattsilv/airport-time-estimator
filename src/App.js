import React from 'react';
import {Container} from 'react-bootstrap';
import Footer from './components/Footer';
import AppRouter from './routes/AppRouter';

function App() {
  return (
    <Container fluid="lg md">
      <AppRouter />

      <Footer />
    </Container>
  );
}

export default App;
