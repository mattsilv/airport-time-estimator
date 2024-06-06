import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {Home} from '../pages/Home';
import {AppNavbar} from './AppNavbar';

function AppRouter() {
  return (
    <BrowserRouter>
      <AppNavbar />

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
