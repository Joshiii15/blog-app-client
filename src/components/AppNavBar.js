import React, { useContext, useEffect } from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
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
      <Navbar expand="lg" className="navbar bg-body-tertiary">
        <Container>
          <Navbar.Brand>Zuitt Blogs</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={NavLink} to="/">
                Home
              </Nav.Link>
              {isLoggedIn ? (
                isAdmin ? (
                  <>
                    <Nav.Link as={NavLink} to="/admin">
                      Dashboard
                    </Nav.Link>
                    <Nav.Link
                      as="span"
                      onClick={handleLogout}
                      style={{ cursor: "pointer" }}
                    >
                      Logout
                    </Nav.Link>
                  </>
                ) : (
                  <>
                    <Nav.Link
                      as="span"
                      onClick={handleLogout}
                      style={{ cursor: "pointer" }}
                    >
                      Logout
                    </Nav.Link>
                  </>
                )
              ) : (
                <>
                  <Nav.Link as={NavLink} to="/login">
                    Login
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/register">
                    Register
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default AppNavBar;
