import { Button, Table } from "react-bootstrap";
import axios from "../api/axios";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ImCross } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const fetchAllOrders = async () => {
  const { data } = await axios.get("/api/orders");

  return data.orders;
};

const AllOrdersPage = () => {
  const navigate = useNavigate();

  const {userDetails} = useSelector((state) => state.user)

  useEffect(() =>{
    if(!userDetails?.isAdmin){
      navigate('/')
    }
  }, [userDetails])

  const { data: orders } = useQuery({
    queryKey: ["AllAdminOrders"],
    queryFn: fetchAllOrders,
  });

  console.log(orders);

  return (
    <div>
      <h2>Orders</h2>
      <Table bordered hover  className="table-sm" >
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Date</th>
            <th>Total</th>
            <th>Paid</th>
            <th>Delivered</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {orders?.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.user ? order.user.name : "NA"}</td>
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
                <Button
                  variant="light"
                  onClick={() => navigate(`/orders/${order._id}`)}
                >
                  Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
export default AllOrdersPage;
