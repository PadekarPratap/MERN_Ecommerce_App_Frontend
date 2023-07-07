import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../api/axios";
import { useEffect, useState } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";


const deleteProduct = async (id) => {
  const { data } = await axios.delete(`/api/products/${id}`);

  return data;
};

const AllProductsPage = () => {

  const[pageNum, setPageNum] = useState(1)

  const { userDetails } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userDetails.isAdmin) {
      navigate("/");
    }
  }, [userDetails, navigate]);

  const fetchAllProducts = async () => {
    const { data } = await axios.get(`/api/products?pageNumber=${pageNum}`);
  
    return data;
  };

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["adminAllProducts", pageNum],
    queryFn: fetchAllProducts,
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["adminAllProducts"] });
      queryClient.refetchQueries({ queryKey: ["adminAllProducts"] });
    },
  });

  const deleteProductHandler = (id) => {
    if (confirm("Do you want to delete this product")) {
      // delete product
      mutate(id);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader loaderSize={30} />
      ) : isError ? (
        <Message>{error.response.data.message}</Message>
      ) : (
        <div>
          <Row>
            <Col>
              <h2>Products</h2>
            </Col>
            <Col>
              <Button
                onClick={() => navigate("/admin/product/create")}
                className="d-block ms-auto"
                variant="dark"
              >
                + Create Product
              </Button>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <Table bordered>
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Qty</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {data?.products?.map((product, index) => (
                    <tr key={product._id}>
                      <td>{index + 1}</td>
                      <td>{product._id}</td>
                      <td>{product.name}</td>
                      <td>$ {product.price}</td>
                      <td>{product.category}</td>
                      <td>{product.brand}</td>
                      <td>{product.qty}</td>
                      <td className="d-flex gap-3 align-items-center">
                        <Link
                          to={`/admin/product/${product._id}/edit`}
                          className="btn btn-light"
                        >
                          Edit
                        </Link>
                        <Button
                          onClick={() => deleteProductHandler(product._id)}
                          variant="danger"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </div>
      )}
      {data?.pages > 1 && <div className="d-flex align-items-center gap-2 justify-content-center mt-4">
        <Button disabled={pageNum <= 1} onClick={() => setPageNum(prev => prev - 1)} variant="light">Prev</Button>
        {data?.page} of {data?.pages}
        <Button disabled={pageNum >= data?.pages}  onClick={() => setPageNum(prev => prev + 1)} variant="light">Next</Button>
      </div>}
    </>
  );
};
export default AllProductsPage;
