import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { onLogoutUser } from "../redux/features/userSlice";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { RESET_CART } from "../redux/features/cartSlice";
import SearchProducts from "./SearchProducts";

const Header = () => {
  const { userDetails } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    dispatch(RESET_CART());
    dispatch(onLogoutUser());
    try {
      const { data } = await axios.get(`/api/users/logout`);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
    navigate("/");
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      const expirationDate = user.expiresAt;
      if (expirationDate < Date.now()) {
        logoutHandler();
      }
    } else {
      logoutHandler();
    }
  }, [dispatch]);

  return (
    <header>
      <Navbar expand="lg" className="bg-dark" data-bs-theme="dark">
        <Container>
          <LinkContainer to={"/"}>
            <Navbar.Brand>Code Shop Pro</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <SearchProducts />
            <Nav className="ms-auto">
              <LinkContainer to={"/cart"}>
                <Nav.Link className="d-flex align-items-center gap-2">
                  <FaShoppingCart size={20} />
                  <span>Cart</span>
                </Nav.Link>
              </LinkContainer>
              {userDetails ? (
                <NavDropdown title={userDetails.name} id="login-dropdown">
                  <NavDropdown.Item
                    className="text-white"
                    onClick={() => navigate("/profile")}
                  >
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    className="text-white"
                    onClick={logoutHandler}
                  >
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to={"/login"}>
                  <Nav.Link className="d-flex align-items-center gap-2">
                    <CgProfile size={20} />
                    <span>Sign In</span>
                  </Nav.Link>
                </LinkContainer>
              )}
              {userDetails && userDetails.isAdmin ? (
                <NavDropdown title={"Admin User"} id="admin_user">
                  <NavDropdown.Item as="div">
                    <Link className="text-white" to="/admin/users">
                      Users
                    </Link>
                  </NavDropdown.Item>
                  <NavDropdown.Item as="div">
                    <Link className="text-white" to="/admin/products">
                      Products
                    </Link>
                  </NavDropdown.Item>
                  <NavDropdown.Item as='div'>
                    <Link className="text-white" to='/admin/orders' >Orders</Link>
                  </NavDropdown.Item>
                </NavDropdown>
              ) : null}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};
export default Header;
