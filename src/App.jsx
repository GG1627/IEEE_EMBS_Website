import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/main/Home";
import Team from "./pages/main/Team";
import About from "./pages/main/About";
import Events from "./pages/main/Events";
import Careers from "./pages/main/Careers";
import Research from "./pages/branches/Research";
import Projects from "./pages/branches/Projects";
import Outreach from "./pages/branches/Outreach";
import Workshops from "./pages/branches/Workshops";
import Industry from "./pages/branches/Industry";
import Networking from "./pages/branches/Networking";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import { SnackbarProvider } from "./components/ui/Snackbar";
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
              <Route path="/careers" element={<Careers />} />

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
