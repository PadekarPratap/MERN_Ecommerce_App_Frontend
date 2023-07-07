import { useMutation } from "@tanstack/react-query";
import axios from "../api/axios";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { onUserUpdate } from "../redux/features/userSlice";
import Message from "../components/Message";
import { toast } from "react-toastify";
import FetchUserOrders from "../components/FetchUserOrders";

const updateUser = async (values) => {
  const { data } = await axios.put(`/api/users/profile/update`, values);
  return data;
};

const Profile = () => {
  const dispatch = useDispatch();

  const form = useForm({
    defaultValues: async () => {
      const { data } = await axios.get(`/api/users/profile`);
      const { user } = data;
      return {
        name: user.name,
        email: user.email,
      };
    },
  });
  const { register, handleSubmit, watch, formState } = form;
  const { errors } = formState;

  const { mutate, isError, error, isLoading } = useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      toast.success(data.message);
      const { user } = data;
      dispatch(onUserUpdate({ email: user.email, name: user.name }));
    },
  });

  const handleUpdate = (values) => {
    if (values.password) {
      const { name, email, password } = values;
      mutate({ name, email, password });
    } else {
      const { name, email } = values;
      mutate({ name, email });
    }
  };

  const password = watch("password");

  return (
    <Row>
      <Col md={3}>
        <h2>Profile</h2>
        {isError && <Message>{error.response.data.message}</Message>}
        <Form noValidate onSubmit={handleSubmit(handleUpdate)}>
          <Form.Group className="mb-4">
            <Form.Label>Name</Form.Label>
            <Form.Control
              {...register("name", {
                required: {
                  value: true,
                  message: "Name cannot be an empty field",
                },
              })}
              type="text"
              placeholder="Enter name"
            />
            {errors.name?.message && <small>{errors.name.message}</small>}
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Email</Form.Label>
            <Form.Control
              {...register("email", {
                required: {
                  value: true,
                  message: "Email cannot be an empty field",
                },
              })}
              type="email"
              placeholder="Enter email"
            />
            {errors.email?.message && <small>{errors.email.message}</small>}
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              {...register("password")}
              type="password"
              placeholder="Enter password"
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              {...register("confirm_password", {
                validate: {
                  confirmPassword: (val) => {
                    if (val !== password && password !== undefined) {
                      return "Passwords do not match";
                    }
                  },
                },
              })}
              type="password"
              placeholder="Confirm password"
            />
            {errors.confirm_password?.message && (
              <small>{errors.confirm_password.message}</small>
            )}
          </Form.Group>
          <Form.Group className="mt-4">
            <Button disabled={isLoading} type="submit" variant="dark">
              Update
            </Button>
          </Form.Group>
        </Form>
      </Col>
      <Col md={9}>
        <h2 className="text-uppercase">My Orders</h2>
        <FetchUserOrders />
      </Col>
    </Row>
  );
};
export default Profile;
