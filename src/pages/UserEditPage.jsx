import { useMutation } from "@tanstack/react-query";
import axios from "../api/axios";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";

const UserEditPage = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const updateUser = async (values) => {
    const { data } = await axios.put(`/api/users/${id}`, values);
    return data;
  };

  const form = useForm({
    defaultValues: async () => {
      const { data } = await axios.get(`/api/users/${id}`);
      const { user } = data;
      return {
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      };
    },
  });

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      console.log(data);
      navigate("/admin/users");
    },
  });

  const { handleSubmit, register, formState } = form;
  const { errors } = formState;

  const updateHandler = (values) => {
    console.log(values);
    const { name, email, isAdmin } = values;
    mutate({ name, email, isAdmin });
  };

  return (
    <>
      <div>
        <Button variant="light" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
      {isLoading ? (
        <Loader loaderSize={35} />
      ) : isError ? (
        <Message>{error.response.data.message}</Message>
      ) : (
        <Form
          noValidate
          className="form-container"
          onSubmit={handleSubmit(updateHandler)}
        >
          <h2>Edit User</h2>
          <Form.Group className="mt-4">
            <Form.Label>Name</Form.Label>
            <Form.Control
              {...register("name", {
                required: {
                  value: true,
                  message: "Name is a required field",
                },
              })}
              type="text"
              placeholder="Enter name"
            />
            {errors.name?.message && <small>{errors.name?.message}</small>}
          </Form.Group>

          <Form.Group className="mt-4">
            <Form.Label>Email</Form.Label>
            <Form.Control
              {...register("email", {
                required: {
                  value: true,
                  message: "Email is a required field",
                },
                validate: {
                  isValidEmail: (val) =>
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                      val
                    ) || "Invalid Email Address",
                },
              })}
              type="email"
              placeholder="Enter email"
            />
            {errors.email?.message && <small>{errors.email?.message}</small>}
          </Form.Group>

          <Form.Group className="mt-4">
            <Form.Check
              {...register("isAdmin")}
              type="checkbox"
              label="Admin"
            />
          </Form.Group>

          <div className="mt-4">
            <button disabled={isLoading} className="btn btn-dark" type="submit">
              Update
            </button>
          </div>
        </Form>
      )}
    </>
  );
};
export default UserEditPage;
