import { useMutation } from "@tanstack/react-query";
import axios from "../api/axios";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Meta from "../components/Meta";

const signUpUser = async (values) => {
  const { data } = await axios.post(`/api/users/create`, values);
  return data;
};

const SignUp = () => {
  const form = useForm();
  const { register, handleSubmit, watch, formState } = form;
  const { errors } = formState;

  const navigate = useNavigate();
  const { userDetails } = useSelector((state) => state.user);

  useEffect(() => {
    if (userDetails) {
      navigate("/");
    }
  }, []);

  const { mutate, error, isError, isLoading } = useMutation({
    mutationFn: signUpUser,
    onSuccess: () => {
      toast.success("Registration successfull");
      navigate("/login");
    },
  });

  const formHandler = (values) => {
    const { name, email, password } = values;
    mutate({ name, email, password });
  };

  const password = watch("password");

  return (
    <>
    <Meta title='Create a Account | Code Shop Pro' />
      <div className="form-container">
        <h1 className="mb-4">Register</h1>
        {isError && (
          <div className="mb-4">
            <Message>{error.response.data.message}</Message>
          </div>
        )}
        <Form noValidate onSubmit={handleSubmit(formHandler)}>
          <Row className="mb-4">
            <Col>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  {...register("name", {
                    required: {
                      value: true,
                      message: "Name is a required field",
                    },
                    minLength: {
                      value: 3,
                      message: "Name must contain atleast 3 characters",
                    },
                  })}
                  type="text"
                  placeholder="Enter name"
                />
                {errors.name?.message && <small>{errors.name.message}</small>}
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  {...register("email", {
                    required: {
                      value: true,
                      message: "Email is a required field",
                    },
                    validate: {
                      checkEmail: (val) =>
                        /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(
                          val
                        ) || "Invalid Email address",
                    },
                  })}
                  type="email"
                  placeholder="Enter email"
                />
                {errors.email?.message && <small>{errors.email.message}</small>}
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  {...register("password", {
                    required: {
                      value: true,
                      message: "Password is a required field",
                    },
                  })}
                  type="password"
                  placeholder="Enter password"
                />
                {errors.password?.message && (
                  <small>{errors.password.message}</small>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col>
              <Form.Group>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  {...register("confirm_password", {
                    required: {
                      value: true,
                      message: "Confirm your password",
                    },
                    validate: {
                      confirmPassword: (val) => {
                        if (password !== val) {
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
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                className="d-flex gap-2"
                disabled={isLoading}
                variant="dark"
                type="submit"
              >
                <span>Register</span> {isLoading && <Loader loaderSize={20} />}
              </Button>
            </Col>
          </Row>
        </Form>
        <div className="mt-4">
          <p>
            Already have an account?{" "}
            <Link className="fw-bold" to="/login">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};
export default SignUp;
