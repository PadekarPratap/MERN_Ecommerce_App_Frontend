import { useQuery } from "@tanstack/react-query";
import axios from '../api/axios'
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { CHANGE_QTY } from "../redux/features/cartSlice";

const fetchProductQty = async (id) => {
  const { data } = await axios.get(`/api/products/${id}`);
  const { product } = data;
  return product.countInStock;
};

const FetchOptions = ({ id, qty }) => {
  const dispatch = useDispatch();
  const [values, setValues] = useState(qty);

  const { data } = useQuery({
    queryKey: ["product-values", id],
    queryFn: () => fetchProductQty(id),
  });
 
  // console.log(data);

  useEffect(() => {
    dispatch(CHANGE_QTY({ product: id, qty: parseInt(values) }));
  }, [values]);

  return (
    <Form.Select value={values} onChange={(e) => setValues(e.target.value)}>
      {data <= 0 ? (
        <option disabled={true}>No stock available</option>
      ) : data <= 10 ? (
        [...Array(data).keys()].map((item) => (
          <option key={item + 1}>{item + 1}</option>
        ))
      ) : (
        [...Array(10).keys()].map((item) => (
          <option key={item + 1}>{item + 1}</option>
        ))
      )}
    </Form.Select>
  );
};
export default FetchOptions;
