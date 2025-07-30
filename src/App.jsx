import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Team from "./pages/Team";
import About from "./pages/About";
import Events from "./pages/Events";
import Research from "./pages/Research";
import Projects from "./pages/Projects";
import Outreach from "./pages/Outreach";
import Workshops from "./pages/Workshops";
import Industry from "./pages/Industry";
import Networking from "./pages/Networking";

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
          
          <Route path="/research" element={<Research />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/outreach" element={<Outreach />} />
          <Route path="/workshops" element={<Workshops />} />
          <Route path="/industry" element={<Industry />} />
          <Route path="/networking" element={<Networking />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
