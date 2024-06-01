import React from 'react';
import {Container} from 'react-bootstrap';
import Footer from './components/Footer';
import AppRouter from './routes/AppRouter';
import {GlobalStateProvider} from './context/GlobalStateContext';

function App() {
  return (
    <Container fluid="lg md">
      <GlobalStateProvider>
        <AppRouter />
      </GlobalStateProvider>

      <Footer />
    </Container>
  );
}

export default App;
