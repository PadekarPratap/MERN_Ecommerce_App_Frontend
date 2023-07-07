import { useQuery } from "@tanstack/react-query";
import axios from "../api/axios";
import { format } from "date-fns";
import { Button, Table } from "react-bootstrap";
import { ImCross } from "react-icons/im";
import { useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import Loader from "./Loader";
import Message from "./Message";

const fetchUserOrders = async () => {
  const { data } = await axios.get("/api/orders/myorders");

  return data;
};

const FetchUserOrders = () => {
  const { userDetails } = useSelector((state) => state.user);

  const {
    data: myOrders,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userOrders", userDetails._id],
    queryFn: fetchUserOrders,
  });

  console.log(myOrders);

  return (
    <>
      {isLoading ? (
        <Loader loaderSize={35} />
      ) : isError ? (
        <Message variant="primary" marginTop="mt-1">
          {error.response.data.message}
        </Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {myOrders?.orders.map((order) => (
              <tr key={order._id}>
                <td className="text-uppercase">{order._id}</td>
                <td>{format(new Date(order.createdAt), "dd, MMM yyyy")}</td>
                <td>$ {order.totalPrice.toFixed(2)}</td>
                <td>
                  {order.isPaid ? (
                    <span className="text-green">
                      {format(new Date(order.paidAt), "dd, MMM yyyy")}
                    </span>
                  ) : (
                    <ImCross color="red" />
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    <span className="text-green">
                      {format(new Date(order.deliveredAt), "dd, MMM yyyy")}
                    </span>
                  ) : (
                    <ImCross color="red" />
                  )}
                </td>
                <td>
                  <LinkContainer to={`/orders/${order._id}`}>
                    <Button variant="light">Details</Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};
export default FetchUserOrders;
