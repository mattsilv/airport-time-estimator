import React from 'react';
import {Container} from 'react-bootstrap';
import Footer from './components/Footer';
import AppRouter from './Routes/AppRouter';
import {GlobalStateProvider} from './context/GlobalStateContext';

function App() {
  return (
    <Container className="mt-4">
      <GlobalStateProvider>
        <AppRouter />
      </GlobalStateProvider>

      <Footer />
    </Container>
  );
}

export default App;
