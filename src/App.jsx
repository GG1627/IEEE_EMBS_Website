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
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import { SnackbarProvider } from "./components/Snackbar";
import { AuthProvider } from "./pages/auth/AuthContext";

function App() {
  return (
    <>
      <AuthProvider>
        <SnackbarProvider>
          <BrowserRouter>
            <Navbar />
            <div className="fixed top-16 left-0 right-0 z-40 h-4 w-full bg-gradient-to-b from-white to-transparent pointer-events-none"></div>

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
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </BrowserRouter>
        </SnackbarProvider>
      </AuthProvider>
    </>
  );
}

export default App;
