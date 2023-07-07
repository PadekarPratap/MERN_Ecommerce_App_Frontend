import { useMutation } from "@tanstack/react-query";
import axios from "../api/axios";
import { useEffect } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const createProduct = async (values) => {
  const { data } = await axios.post(`/api/products`, values, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

const CreateProductPage = () => {
  const { userDetails } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userDetails.isAdmin) {
      navigate("/");
    }
  }, [userDetails, navigate]);

  const form = useForm();
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  const { mutate, isLoading } = useMutation({
    mutationFn: createProduct,
    onSuccess: (data) => {
      console.log(data);
      toast.success("New Product Created");
      navigate("/admin/products");
    },
  });

  const createProductHandler = async (values) => {
    const formData = new FormData();
    const { image } = values;
    const imageFile = image[0];
    formData.append("name", values.name);
    formData.append("price", values.price);
    formData.append("description", values.description);
    formData.append("countInStock", values.countInStock);
    formData.append("category", values.category);
    formData.append("brand", values.brand);
    formData.append("image", imageFile);
    mutate(formData);
  };

  return (
    <div>
      <Form
        className="form-container"
        noValidate
        onSubmit={handleSubmit(createProductHandler)}
      >
        <h2>Create Product</h2>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            {...register("name", {
              required: {
                value: true,
                message: "Product name cannot be empty!",
              },
            })}
            type="text"
          />
          {errors.name?.message && <small>{errors.name.message}</small>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            {...register("description", {
              required: {
                value: true,
                message: "Product description cannot be empty!",
              },
            })}
            as="textarea"
            rows={5}
          />
          {errors.description?.message && (
            <small>{errors.description.message}</small>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control
            {...register("price", {
              required: {
                value: true,
                message: "Product price cannot be empty!",
              },
            })}
            type="number"
          />
          {errors.price?.message && <small>{errors.price.message}</small>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Brand</Form.Label>
          <Form.Control
            {...register("brand", {
              required: {
                value: true,
                message: "Product brand cannot be empty!",
              },
            })}
            type="text"
          />
          {errors.brand?.message && <small>{errors.brand.message}</small>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Select
            {...register("category", {
              required: {
                value: true,
                message: "Product category cannot be empty!",
              },
            })}
            defaultValue=""
          >
            <option value="" disabled hidden>
              -Select a Category-
            </option>
            <option value="Electronics">Electronics</option>
            <option value="Mobiles">Mobiles</option>
            <option value="Men's Wear">Men&apos;s Wear</option>
            <option value="Women's Wear">Women&apos;s Wear</option>
            <option value="Toys">Toys</option>
          </Form.Select>
          {errors.category?.message && <small>{errors.category.message}</small>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Count in Stock</Form.Label>
          <Form.Control
            {...register("countInStock", {
              required: {
                value: true,
                message: "Product stock cannot be empty!",
              },
            })}
            type="number"
          />
          {errors.countInStock?.message && (
            <small>{errors.countInStock.message}</small>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Image</Form.Label>
          <Form.Control
            {...register("image", {
              required: {
                value: true,
                message: "Product must have an Image",
              },
            })}
            type="file"
          />
          {errors.image?.message && <small>{errors.image.message}</small>}
        </Form.Group>

        <div>
          <button
            disabled={isLoading}
            type="submit"
            className="btn btn-dark d-flex gap-3"
          >
            <span>Create</span>
            {isLoading && <Loader loaderSize={20} />}
          </button>
        </div>
      </Form>
    </div>
  );
};
export default CreateProductPage;
