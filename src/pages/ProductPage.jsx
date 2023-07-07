import { Button, Col, Form, ListGroup, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Rating from "../components/Rating";
import { useQuery } from "@tanstack/react-query";
import axios from "../api/axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ADD_TO_CART } from "../redux/features/cartSlice.js";
import ReviewsOfProducts from "../components/ReviewsOfProducts";

const fetchProduct = async (id) => {
  const { data } = await axios.get(`/api/products/${id}`);
  const { product } = data;
  return product;
};

const ProductPage = () => {
  const dispatch = useDispatch();
  const {cartItems} = useSelector((state) => state.cart)
  const navigate = useNavigate();
  const { id } = useParams();

  const [qty, setQty] = useState(1);

  const { data: product } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
  });

  const addToCartHandler = () => {
    const item = {
      name: product.name,
      price: product.price,
      qty: parseInt(qty),
      product: id, // productId
      image: product.image,
    };
    dispatch(ADD_TO_CART(item));
    navigate("/cart");
  };

  const productExistInCart = () => {
    const productExist = cartItems.findIndex((item) => item.product === product?._id)
    return productExist === -1 ? false : true
  }

  const isDisabled = productExistInCart()

  return (
    <>
      <div>
        <Button onClick={() => navigate(-1)} variant="light">
          Go Back
        </Button>
      </div>
      <Row className="mt-3">
        <Col lg={6}>
          <img
            className="product-img"
            src={product?.image}
            alt={product?.name}
          />
        </Col>
        <Col lg={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h1 className="fs-2">{product?.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                value={product?.rating}
                numReviews={product?.numReviews}
              />
            </ListGroup.Item>
            <ListGroup.Item>
              <p className="fs-5">
                Price: <sup>$</sup>
                <span className="fw-bold">{product?.price}</span>
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <p>{product?.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col lg={3}>
          <ListGroup>
            <ListGroup.Item>Price: ${product?.price}</ListGroup.Item>
            <ListGroup.Item>
              Status: <span className={product?.countInStock > 0 ? "text-green" : "text-red"}>{product?.countInStock > 0 ? "In Stock" : "Out of Stock"}</span>
            </ListGroup.Item>
            {product?.countInStock > 0 && (
              <ListGroup.Item>
                <Form.Select
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                >
                  {product?.countInStock <= 10
                    ? [...Array(product?.countInStock).keys()].map((elem) => (
                        <option key={elem + 1} value={elem + 1}>
                          {elem + 1}
                        </option>
                      ))
                    : [...Array(10).keys()].map((elem) => (
                        <option key={elem + 1} value={elem + 1}>
                          {elem + 1}
                        </option>
                      ))}
                </Form.Select>
              </ListGroup.Item>
            )}
            <ListGroup.Item>
              <Button
                disabled={product?.countInStock <= 0 || isDisabled}
                className="w-100"
                variant="dark"
                onClick={addToCartHandler}
              >
                {isDisabled ? "Added to Cart" : 'Add to Cart' }
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
      <ReviewsOfProducts productId={id} reviews={product?.reviews}  />
    </>
  );
};
export default ProductPage;
