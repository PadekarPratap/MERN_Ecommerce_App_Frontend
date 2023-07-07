import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { filter_page } from "../redux/features/globalSlice";

const FilterProducts = () => {
  const [filteration, setFilteration] = useState("");
  const dispatch = useDispatch()

  useEffect(() => {

    dispatch(filter_page(filteration))

  }, [filteration])

  return (
    <div className="d-flex justify-content-end">
      <div>
        <Form.Select
          value={filteration}
          onChange={(e) => setFilteration(e.target.value)}
        >
          <option value="">All</option>
          <option value="Electronics">Electronics</option>
          <option value="Men's Wear">Men&apos;s Wear</option>
          <option value="Women's Wear">Women&apos;s Wear</option>
          <option value="Mobiles">Mobiles</option>
          <option value="Toys">Toys</option>
        </Form.Select>
      </div>
    </div>
  );
};
export default FilterProducts;
