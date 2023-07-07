import { Button, Col, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import { Link, useNavigate } from "react-router-dom";
import FetchOptions from "../components/FetchOptions";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { REMOVE_FROM_CART } from "../redux/features/cartSlice";
import Meta from "../components/Meta";

const Cart = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userDetails } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalItems = cartItems?.reduce((acc, val) => (acc += val.qty), 0);
  const totalPrice = cartItems?.reduce((acc, val) => (acc += (val.price * val.qty)), 0);

  const removeFromCart = (id) => {
    dispatch(REMOVE_FROM_CART({ id }));
  };

  const proceedCheckout = () => {
    if (userDetails) {
      navigate("/checkout");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
    <Meta title='Code Shop Pro | Cart' />
    <Row>
      <Col md={8}>
        <h1 className="mb-4">Shopping Cart</h1>
        {cartItems?.length === 0 && (
          <Message variant="primary">
            Your cart is Empty.{" "}
            <Link className="text-primary link-primary" to="/">
              Go Home
            </Link>
          </Message>
        )}
        {cartItems?.length > 0 && (
          <ListGroup variant="flush">
            {cartItems.map((cartItem) => (
              <ListGroup.Item key={cartItem.product}>
                <Row>
                  <Col md={3}>
                    <img src={cartItem.image} alt={cartItem.name} />
                  </Col>
                  <Col md={3}>
                    <Link to={`/products/${cartItem.product}`}>
                      {cartItem.name}
                    </Link>
                  </Col>
                  <Col md={2}>
                    <p>${cartItem.price?.toFixed(2)}</p>
                  </Col>
                  <Col md={4}>
                    <Row>
                      <Col>
                        <FetchOptions
                          id={cartItem.product}
                          qty={cartItem.qty}
                        />
                      </Col>
                      <Col>
                        <RiDeleteBin2Fill
                          onClick={() => removeFromCart(cartItem.product)}
                          className="d-block m-auto del-icon"
                          size={30}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <ListGroup>
          <ListGroup.Item>
            <h4 className="text-uppercase">Subtotal ({totalItems}) items</h4>
            <h5>${totalPrice?.toFixed(2)}</h5>
          </ListGroup.Item>
          <ListGroup.Item>
            <Button
              disabled={cartItems.length === 0}
              variant="dark"
              onClick={proceedCheckout}
            >
              Proceed to Checkout
            </Button>
          </ListGroup.Item>
        </ListGroup>
      </Col>
    </Row>

    </>
  );
};
export default Cart;
