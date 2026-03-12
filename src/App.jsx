import SchedulePage from "./pages/Schedule";
import StaffPage from "./pages/Staff";
import ServicesPage from "./pages/Services";
import "./global.css";
import Header from "./components/organisms/Header";
import { useGlobalContext } from "./store/GlobalContext";

function App() {
  const { page } = useGlobalContext();

  return (
    <main>
      <Header />

      <div className="container">
        {page === "schedule" && <SchedulePage />}

        {page === "staff" && <StaffPage />}

        {page === "services" && <ServicesPage />}
      </div>
    </main>
  );
}

export default App;
