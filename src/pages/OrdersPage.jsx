import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../api/axios";
import { Button, Col, ListGroup, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Message from "../components/Message";
import { format } from "date-fns";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const fetchOrderDetails = async (orderId) => {
  const { data } = await axios.get(`/api/orders/${orderId}`);
  const { order } = data;
  return order;
};

const OrdersPage = () => {

  const navigate = useNavigate() 
  const { orderId } = useParams();
  const {userDetails} = useSelector((state) => state.user)

  const updateOrder = async () =>{
    const {data} = await axios.put(`/api/orders/${orderId}/update`, {
      isDelivered: true,
      deliveredAt: new Date(Date.now())
    })

    return data
  }
  

  const { mutate, isLoading:updateOrderLoading } = useMutation({
    mutationFn: updateOrder,
    onSuccess: (data) =>{
      console.log(data)
      toast.success('Order marked as delivered!')
      navigate('/admin/orders')
    }
  })

  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrderDetails(orderId),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
  // console.log(order);

  // calculate itemsPrice -> not saved in the backend

  const itemsPrice = order?.orderItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );

  const deliveredHandler = () =>{
    if(confirm('Do you want to mark this order as "Delivered"')){
      mutate()
    }
  }

  const paymentHandler = async () => {
    const { data: key } = await axios.get("/api/config/key");
    console.log(key);

    const options = {
      key, // Enter the Key ID generated from the Dashboard
      amount: parseInt(order?.totalPrice * 100), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "USD",
      name: "Code Shop Pro",
      description:
        "This is a test senario made to test a MERN stack app with Razorpay",
      image:
        "https://i.pinimg.com/originals/ef/82/4e/ef824ee86efb3ec6cc6eb6758cd5e70c.png",
      order_id: order?.orderStatus.orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      callback_url: `https://mern-stack-ecommerce-app-code-shop-pro.onrender.com/api/paymentverification`,
      prefill: {
        name: order?.user.name,
        email: order?.user.email,
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#83cceb",
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  };

  const amountToPay = parseFloat(order?.totalPrice.toFixed(2) * 100);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message>{error.message}</Message>
      ) : (
        <div>
          <h1 className="text-uppercase mb-3">Order id {order?._id}</h1>

          <Row>
            <Col md={8}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2 className="text-uppercase">Shipping</h2>
                  <p>
                    Name: <span className="fw-bold">{order?.user?.name}</span>
                  </p>
                  <p>
                    Email: <span className="fw-bold">{order?.user?.email}</span>
                  </p>
                  <p>
                    Address:
                    <span className="fw-bold">
                      {order?.shippingAddress?.address},
                      {order?.shippingAddress.city}
                      {order?.shippingAddress?.postalCode},
                      {order?.shippingAddress?.country}
                    </span>
                  </p>
                  {order?.isDelivered ? (
                    <Message marginTop="mt-1" variant="success">
                      Order delivered at {order?.deliveredAt}
                    </Message>
                  ) : (
                    <Message marginTop="mt-1" variant="danger">
                      Not delivered
                    </Message>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <h2 className="text-uppercase">Payment method</h2>
                  <p>
                    Method:
                    <span className="fw-bold text-capitalize">
                      {order?.paymentMethod}
                    </span>
                  </p>
                  {order?.isPaid ? (
                    <Message marginTop="mt-1" variant="success">
                      Paid at {format(new Date(order?.paidAt), "dd MMM, yyyy")}
                    </Message>
                  ) : (
                    <Message marginTop="mt-1">Not Paid</Message>
                  )}
                </ListGroup.Item>

                <ListGroup.Item>
                  {order?.orderItems.length === 0 && (
                    <Message>Your order is Empty.</Message>
                  )}
                  {order?.orderItems.length > 0 && (
                    <ListGroup variant="flush">
                      {order?.orderItems.map((item) => (
                        <ListGroup.Item key={item?.product}>
                          <Row>
                            <Col md={2}>
                              <img src={item?.image} alt={item?.name} />
                            </Col>
                            <Col md={6}>
                              <p>{item?.name}</p>
                            </Col>
                            <Col md={4}>
                              <p>
                                {item?.qty} x $ {item?.price.toFixed(2)} = ${" "}
                                {(item?.qty * item?.price).toFixed(2)}
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
                  <h2 className="text-uppercase">Order Summary</h2>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Items:</Col>
                    <Col>$ {itemsPrice?.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Shipping:</Col>
                    <Col>$ {order?.shippingPrice?.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Tax:</Col>
                    <Col>$ {order?.taxPrice?.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Total:</Col>
                    <Col>$ {order?.totalPrice?.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                {!order?.isPaid && order?.user._id === userDetails._id && (
                  <ListGroup.Item>
                    {/* payment button  */}
                    <Button
                      variant="success"
                      onClick={() => paymentHandler(amountToPay)}
                    >
                      Pay Now
                    </Button>
                  </ListGroup.Item>
                )}

                {userDetails.isAdmin && order.isPaid && !order.isDelivered && (
                  <ListGroup.Item>
                    <Button disabled={updateOrderLoading} className="d-flex align-items-center gap-3" variant="primary" onClick={deliveredHandler} >
                      <span>Mark as Delivered</span>
                      {updateOrderLoading && <Loader loaderSize={25} />}
                    </Button>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};
export default OrdersPage;
