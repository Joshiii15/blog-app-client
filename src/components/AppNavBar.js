import React, { useContext, useEffect } from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import UserContext from "../UserContext";
import { jwtDecode } from "jwt-decode";

const AppNavBar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);
  const { isAdmin, setIsAdmin } = useContext(UserContext);

  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.getItem("access");
      console.log(token);
      const decodedToken = jwtDecode(token);
      if (decodedToken.isAdmin) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }
  });

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem("access");
    setIsLoggedIn(false);
    navigate("/");
  };
  return (
    <>
      <Navbar expand="lg" className="bg-dark navbar-dark py-3 shadow-sm">
        <Container>
          {/* Brand with a modern font and subtle hover effect */}
          <Navbar.Brand as={NavLink} to="/" className="fw-bold text-light fs-4">
            🚀 Zuitt Blogs
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbar-nav" className="border-0" />

          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto align-items-center gap-3">
              <Nav.Link as={NavLink} to="/" className="nav-link-custom">
                Home
              </Nav.Link>

              {isLoggedIn ? (
                isAdmin ? (
                  <>
                    <Nav.Link
                      as={NavLink}
                      to="/admin"
                      className="nav-link-custom"
                    >
                      Dashboard
                    </Nav.Link>
                    <Button
                      variant="outline-light"
                      className="btn-sm px-3"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline-light"
                    className="btn-sm px-3"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                )
              ) : (
                <>
                  <Button
                    as={NavLink}
                    to="/login"
                    variant="light"
                    className="btn-sm px-3"
                  >
                    Login
                  </Button>
                  <Button
                    as={NavLink}
                    to="/register"
                    variant="primary"
                    className="btn-sm px-3"
                  >
                    Register
                  </Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>

        {/* Additional Styling */}
        <style>{`
        .nav-link-custom {
          color: rgba(255, 255, 255, 0.75);
          transition: all 0.3s ease-in-out;
          font-weight: 500;
        }
        .nav-link-custom:hover {
          color: #fff;
          text-shadow: 0px 0px 8px rgba(255, 255, 255, 0.6);
        }
        .navbar-dark .navbar-toggler {
          border-color: transparent;
        }
        .navbar-toggler:focus {
          box-shadow: none;
        }
      `}</style>
      </Navbar>
    </>
  );
};

export default AppNavBar;
