import axios from "../api/axios";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const updateProduct = async (values) => {
    const { data } = await axios.put(`/api/products/${id}`, values, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  };

  const form = useForm({
    defaultValues: async () => {
      const { data } = await axios.get(
        `http://localhost:8080/api/products/${id}`,
        { withCredentials: true }
      );
      console.log(data);
      const { product } = data;
      setLoading(false);
      return {
        name: product.name,
        description: product.description,
        price: product.price,
        countInStock: product.countInStock,
        brand: product.brand,
        category: product.category,
      };
    },
  });
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: updateProduct,
    onSettled: (data) => {
      console.log(data);
      toast.success("Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ["adminAllProducts"] });
      navigate("/admin/products");
    },
  });

  const editProductHandler = (values) => {
    console.log(values);
    const { image } = values;
    const imagePath = image[0];
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("brand", values.brand);
    formData.append("category", values.category);
    formData.append("countInStock", values.countInStock);
    formData.append("image", imagePath);
    mutate(formData);
  };

  return (
    <>
      {loading ? (
        <Loader loaderSize={30} />
      ) : (
        <div>
          <Button variant="light" onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Form
            className="form-container"
            noValidate
            onSubmit={handleSubmit(editProductHandler)}
          >
            <h2>Edit Product</h2>

            <Form.Group className="mb-4">
              <Form.Label>Name</Form.Label>
              <Form.Control
                {...register("name", {
                  required: {
                    value: true,
                    message: "Product name must be provided!",
                  },
                })}
                type="text"
              />
              {errors.name?.message && <small>{errors.name?.message}</small>}
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Description</Form.Label>
              <Form.Control
                {...register("description", {
                  required: {
                    value: true,
                    message: "Product description must be provided!",
                  },
                })}
                as={"textarea"}
                rows={5}
              />
              {errors.description?.message && (
                <small>{errors.description?.message}</small>
              )}
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Price</Form.Label>
              <Form.Control
                {...register("price", {
                  required: {
                    value: true,
                    message: "Product price must be provided!",
                  },
                })}
                type="number"
              />
              {errors.price?.message && <small>{errors.price?.message}</small>}
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                {...register("brand", {
                  required: {
                    value: true,
                    message: "Product brand must be provided!",
                  },
                })}
                type="text"
              />
              {errors.brand?.message && <small>{errors.brand?.message}</small>}
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Category</Form.Label>
              <Form.Select
                {...register("category", {
                  required: {
                    value: true,
                    message: "Product category must be provided!",
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
              {errors.category?.message && (
                <small>{errors.category?.message}</small>
              )}
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                {...register("countInStock", {
                  required: {
                    value: true,
                    message: "Product stock must be provided!",
                  },
                })}
                type="number"
              />
              {errors.countInStock?.message && (
                <small>{errors.countInStock?.message}</small>
              )}
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Image</Form.Label>
              <Form.Control {...register("image")} type="file" />
            </Form.Group>

            <div>
              <Button
                className="d-flex gap-3 align-items-center"
                disabled={isLoading}
                variant="dark"
                type="submit"
              >
                <span>Update</span>
                {isLoading && <Loader loaderSize={20} />}
              </Button>
            </div>
          </Form>
        </div>
      )}
    </>
  );
};
export default EditProductPage;
