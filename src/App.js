import "./App.css";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./UserContext";
import AppNavBar from "./components/AppNavBar";
import Login from "./pages/Login";
import { Home } from "./pages/Home";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard.js";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  //Check token on mount and update isLoggedIn
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      setIsLoggedIn(true);
      //Check if isAdmin
      const decodedToken = jwtDecode(token);
      if (decodedToken.isAdmin) {
        setIsAdmin(true);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);
  return (
    <div className="App">
      <UserProvider value={{ isLoggedIn, setIsLoggedIn, isAdmin, setIsAdmin }}>
        <Router>
          <AppNavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </Router>
      </UserProvider>
    </div>
  );
}

export default App;
