import { Card } from "react-bootstrap";
import Rating from "./Rating";
import { Link } from "react-router-dom";

const Product = ({ product }) => {
  return (
    <Card className="my-3 p-2 min-h">
      <Link to={`/products/${product._id}`}>
        <div className="img-container">
          <Card.Img className="scale-img" src={product.image} />
        </div>
      </Link>
      <Card.Body>
        <Link to={`/products/${product._id}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Card.Text as="div" className="my-3">
          <Rating value={product.rating} numReviews={product.numReviews} />
        </Card.Text>
        <Card.Text className="fs-4 fw-bold">${product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};
export default Product;
