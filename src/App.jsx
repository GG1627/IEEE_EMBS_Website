import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Team from "./pages/Team";
import About from "./pages/About";
import Events from "./pages/Events";
import CheckIn from "./pages/attendance/CheckIn";
import Register from "./pages/attendance/Register";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/team" element={<Team />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/attendance/checkin" element={<CheckIn />} />
          <Route path="/attendance/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
