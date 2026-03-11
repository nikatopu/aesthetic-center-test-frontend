import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import { GlobalProvider } from "./store/GlobalContext";
import { ToastProvider } from "./components/atoms/Toast/ToastProvider";
import SchedulePage from "./pages/Schedule";
import StaffPage from "./pages/Staff";
import ServicesPage from "./pages/Services";
import "./global.css";

function App() {
  return (
    <GlobalProvider>
      <ToastProvider>
        <Router>
          <nav>
            <NavLink to="/" end>
              Schedule
            </NavLink>
            <NavLink to="/staff">Staff</NavLink>
            <NavLink to="/services">Services</NavLink>
          </nav>

          <div className="container">
            <Routes>
              <Route path="/" element={<SchedulePage />} />
              <Route path="/staff" element={<StaffPage />} />
              <Route path="/services" element={<ServicesPage />} />
            </Routes>
          </div>
        </Router>
      </ToastProvider>
    </GlobalProvider>
  );
}

export default App;
