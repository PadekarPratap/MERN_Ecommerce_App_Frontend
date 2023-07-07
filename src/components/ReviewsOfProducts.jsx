import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Col, Form, ListGroup, Row } from "react-bootstrap";
import axios from "../api/axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Message from "./Message";
import Rating from "./Rating";
import { format } from "date-fns";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const ReviewsOfProducts = ({ productId, reviews }) => {
  
    dayjs.extend(relativeTime)

  const { userDetails } = useSelector((state) => state.user);

  const form = useForm();
  const { register, handleSubmit, reset, formState } = form;
  const { isSubmitSuccessful } = formState

  useEffect(() =>{
    if(isSubmitSuccessful){
        reset()
    }
  }, [isSubmitSuccessful])

  const createReview = async (values) => {
    const { data } = await axios.post(
      `/api/products/${productId}/review/create`,
      values
    );
    return data;
  };

  const queryClient = useQueryClient()

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: createReview,
    onSuccess: (data) => {
      console.log(data);
      toast.success("Product review added successfully!");
      queryClient.invalidateQueries({queryKey: ["product", productId]})
    },
  });

  const postReviewHandler = (values) => {
    const { rating, comment } = values;
    if(comment){
        mutate({ rating, comment });
    }else{
        mutate({ rating });
    }
  };

  return (
    <>
      <Row className="mt-5">
        <Col md={6}>
          {reviews?.length === 0 && (
            <Message variant="primary">No reviews found!</Message>
          )}
          {reviews?.length > 0 && (
            <ListGroup>
              {reviews?.map((review) => (
                <ListGroup.Item key={review._id}>
                  <p>{review.name}</p>
                  <Rating value={review.rating} show={false} />
                  <p>{dayjs().to(dayjs(new Date(review.createdAt)))}</p>
                  <p>{review.comment}</p>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={6}>
            <h2>Write a Review!</h2>
          {userDetails ? (
            <Form noValidate onSubmit={handleSubmit(postReviewHandler)}>
              {isError && <Message marginTop='mt-1' >{error.response.data.message}</Message>}
              <Form.Group>
                <Form.Label>Rating</Form.Label>
                <Form.Select
                  {...register("rating", {
                    required: {
                      value: true,
                      message: "Rating is required",
                    },
                  })}
                  defaultValue=""
                >
                  <option value="" disabled hidden>
                    -select rating-
                  </option>
                  <option value="0">0 - Poor</option>
                  <option value="1">1 - Fair</option>
                  <option value="2">2 - Ok</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label>Comment</Form.Label>
                <Form.Control {...register("comment")} as="textarea" rows={3} />
              </Form.Group>

              <div className="mt-4">
                <Button disabled={isLoading} type="submit" variant="dark">
                  Post Review
                </Button>
              </div>
            </Form>
          ) : (
            <Message marginTop='mt-1' variant="info">
              <Link to="/login">Sign In</Link> to write a review
            </Message>
          )}
        </Col>
      </Row>
    </>
  );
};
export default ReviewsOfProducts;
