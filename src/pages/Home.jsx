import { Col, Row } from "react-bootstrap";
import Product from "../components/ProductCard.jsx";
import { useQuery } from "@tanstack/react-query";
import axios from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import Message from "../components/Message.jsx";
import { useSelector } from "react-redux";
import Paginate from "../components/Paginate.jsx";
import FilterProducts from "../components/FilterProducts.jsx";
import Meta from "../components/Meta.jsx";



const Home = () => {

  const { searchKeyword, pageNumber, filter } = useSelector(state => state.global)
  
  const fetchProducts = async () => {
    const { data } = await axios.get(`/api/products?keyword=${searchKeyword}&pageNumber=${pageNumber}&category=${filter}`);
    return data;
  };
  
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products", searchKeyword, pageNumber, filter],
    queryFn: fetchProducts,
  });

  
  return (
    <>
      <Meta />
      <div>
        <h1 className="text-center">Latest Products</h1>
        <FilterProducts />
        {searchKeyword && <h4>Showing results for &quot;{searchKeyword}&quot;</h4>}
        {data?.products.length === 0 && <p>No products found.</p>}
      </div>
      {isLoading ? (
        <div className="mt-5">
          <Loader />
        </div>
      ) : isError ? (
        <Message>
          {error.message}
        </Message>
      ) : (
        <Row>
          {data?.products?.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
      {data?.pages > 1 && <Paginate info={`${data?.page} of ${data?.pages}`} pages={data?.pages} />}
    </>
  );
};
export default Home;
