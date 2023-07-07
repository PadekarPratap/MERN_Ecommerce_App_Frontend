import { Button, Col, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import { useMutation } from "@tanstack/react-query";
import axios from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { RESET_CART } from "../redux/features/cartSlice";
import { useEffect, useState } from "react";
import Meta from "../components/Meta";

const createOrder = async (values) => {
  const { data } = await axios.post(`/api/orders/create`, values);
  return data;
};

const PlaceOrderPage = () => {
  const cart = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems, shippingAddress, paymentMethod } = cart;

  //calculate prices
  const itemPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const shippingPrice = itemPrice > 200 ? 100 : 50;
  const taxPrice = itemPrice * 0.2;
  const totalPrice = itemPrice + shippingPrice + taxPrice;

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      toast.success("Order has been placed successfully!");
      console.log(data);
      navigate(`/orders/${data.order._id}`);
      dispatch(RESET_CART());
    },
  });

  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const createRazorOrder = async () => {
      const { data } = await axios.post(`/api/checkout`, {
        amount: parseInt(totalPrice * 100),
      });
      console.log(data);
      setOrderId(data.order.id);
    };
    createRazorOrder();
  }, []);

  const placeOrder = () => {
    mutate({
      orderItems: cartItems,
      shippingAddress,
      shippingPrice,
      paymentMethod,
      taxPrice,
      totalPrice,
      orderId,
    });
  };

  return (
    <>
    <Meta title='Code Shop Pro | Place Order' />
      <div className="mb-4">
        {isError && <Message>{error.response.data.message}</Message>}
      </div>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>SHIPPING</h2>
              <p>
                Address:{" "}
                <strong>
                  {shippingAddress.address}, {shippingAddress.city}{" "}
                  {shippingAddress.postalCode}, {shippingAddress.country}
                </strong>
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>PAYMENT METHOD</h2>
              <p>
                Method:{" "}
                <strong>
                  <span className="text-capitalize">{paymentMethod}</span>
                </strong>
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>ORDER ITEMS</h2>
              {cartItems.length === 0 && (
                <Message>Your shopping cart is empty.</Message>
              )}
              {cartItems.length > 0 && (
                <ListGroup variant="flush">
                  {cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <img src={item.image} alt={item.name} />
                        </Col>

                        <Col>
                          <p>{item.name}</p>
                        </Col>

                        <Col md={5}>
                          <p>
                            {item.qty} x $ {item.price} = ${" "}
                            {(item.qty * item.price).toFixed(2)}
                          </p>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <ListGroup>
            <ListGroup.Item>
              <h2 className="text-uppercase">order summary</h2>
            </ListGroup.Item>

            <ListGroup.Item>
              <Row>
                <Col>Items:</Col>
                <Col>$ {itemPrice.toFixed(2)}</Col>
              </Row>
            </ListGroup.Item>

            <ListGroup.Item>
              <Row>
                <Col>Shipping:</Col>
                <Col>$ {shippingPrice.toFixed(2)}</Col>
              </Row>
            </ListGroup.Item>

            <ListGroup.Item>
              <Row>
                <Col>Tax:</Col>
                <Col>$ {taxPrice.toFixed(2)}</Col>
              </Row>
            </ListGroup.Item>

            <ListGroup.Item>
              <Row>
                <Col>Total Price:</Col>
                <Col>$ {totalPrice.toFixed(2)}</Col>
              </Row>
            </ListGroup.Item>

            <ListGroup.Item>
              <Button
                className="d-flex align-items-center gap-3"
                disabled={isLoading}
                variant="dark"
                onClick={placeOrder}
              >
                <span>Place order</span>
                {isLoading && <Loader loaderSize={20} />}
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </>
  );
};
export default PlaceOrderPage;
