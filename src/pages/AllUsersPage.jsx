import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../api/axios";
import { useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import { ImCross } from "react-icons/im";
import { RiShieldCheckFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";

const fetchAllUsers = async () => {
  const { data } = await axios.get("/api/users");

  return data.users;
};

const deleteUser = async (id) => {
  const { data } = await axios.delete(`/api/users/${id}`);

  return data;
};

const AllUsersPage = () => {
  const { userDetails } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userDetails.isAdmin) {
      navigate("/");
    }
  }, [userDetails, navigate]);

  const {
    data: AllUsers,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["allUsers"],
    queryFn: fetchAllUsers,
  });

  const queryClient = useQueryClient();

  const { mutate: delete_user } = useMutation({
    mutationFn: deleteUser,
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    },
  });

  const deleteUserHandler = (id) => {
    if (confirm("Are you sure you want to delete this user?")) {
      delete_user(id);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message>{error.response.data.message}</Message>
      ) : (
        <div>
          <Table striped bordered hover className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Admin</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {AllUsers?.map((user) => {
                return (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.isAdmin ? (
                        <RiShieldCheckFill size={20} color="green" />
                      ) : (
                        <ImCross size={20} color="red" />
                      )}
                    </td>
                    <td className="d-flex gap-3">
                      <Link to={`/admin/users/${user._id}/edit`}>
                        <Button variant="light">Edit</Button>
                      </Link>
                      <Button
                        onClick={() => deleteUserHandler(user._id)}
                        variant="danger"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
};
export default AllUsersPage;
