import { useMutation } from "@tanstack/react-query";
import axios from "../api/axios";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Message from "../components/Message";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { onUserSuccess } from "../redux/features/userSlice";
import { useEffect } from "react";
import Meta from "../components/Meta";

const loginUser = async (values) => {
  const { data } = await axios.post(`/api/users/login`, values);
  return data;
};

const Singin = () => {
  const form = useForm();
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.user);

  useEffect(() => {
    if (userDetails) {
      navigate("/");
    }
  }, [userDetails]);

  const { mutate, error, isError, isLoading } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      toast.success("Login Successfull");
      const { user } = data;
      dispatch(onUserSuccess(user));
      navigate("/");
    },
  });

  const formHandler = (values) => {
    mutate(values);
  };

  return (
    <>
    <Meta title='Login | Code Shop Pro' />
      <div className="form-container">
        <h1 className="my-5">Sign In</h1>
        {isError && (
          <div className="mb-3">
            <Message>{error.response.data.message}</Message>
          </div>
        )}
        <Form onSubmit={handleSubmit(formHandler)} noValidate>
          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label htmlFor="email">Email Address</Form.Label>
                <Form.Control
                  {...register("email", {
                    required: {
                      value: true,
                      message: "Please Enter your Email",
                    },
                    validate: {
                      checkEmail: (val) =>
                        /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(
                          val
                        ) || "Invalid Email",
                    },
                  })}
                  type="email"
                  placeholder="Enter email"
                  id="email"
                />
                {errors.email?.message && <small>{errors.email.message}</small>}
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label htmlFor="pass">Password</Form.Label>
                <Form.Control
                  {...register("password", {
                    required: {
                      value: true,
                      message: "Please enter your password",
                    },
                  })}
                  type="password"
                  placeholder="Enter password"
                  id="pass"
                />
                {errors.password?.message && (
                  <small>{errors.password.message}</small>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col>
              <Button
                disabled={isLoading}
                className="d-flex align-items-center gap-4"
                type="submit"
                variant="dark"
              >
                <span>Sign In</span> {isLoading && <Loader loaderSize={30} />}
              </Button>
            </Col>
          </Row>
        </Form>
        <div className="mt-3">
          <p>
            New customer?{" "}
            <Link to="/register" className="fw-bold">
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};
export default Singin;
