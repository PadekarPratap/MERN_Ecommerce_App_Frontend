import { useState } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { BsChevronLeft } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { ADD_PAYMENT_METHOD, ADD_SHIPPING_ADDRESS } from "../redux/features/cartSlice";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import RenderButton from "../components/RenderButton";
import Meta from "../components/Meta";


const CheckoutPage = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

  const { register, formState, handleSubmit } = useForm({
    defaultValues:  async () => {
      const {data} = await axios.get(`/api/users/profile`)
      return {
        address: data.user.userShippingAddress.address || "",
        city: data.user.userShippingAddress.city || "",
        postalCode: data.user.userShippingAddress.postalCode || "",
        country: data.user.userShippingAddress.country || ''
      }
    },
    mode: 'all'
  });
  const { errors } = formState;

  const [formSteps, setFormSteps] = useState(0);

  const handleCheckout = (values) => {
    // console.log(values)
    const {address, city, postalCode, country, paymentMethod} = values
    dispatch(ADD_SHIPPING_ADDRESS({address, city, postalCode, country}))
    dispatch(ADD_PAYMENT_METHOD(paymentMethod))
    updateUserAddress({userShippingAddress: {address, city, postalCode, country}})
    navigate('/place-order')
  };

  const updateUserAddress = async(valueAddress) =>{
      try {
        const {data} = await axios.put(`/api/users/profile/update`, valueAddress)
        console.log(data)
      } catch (err) {
        console.log(err)
      }
  }

  const MAX_STEPS = 1; // 0, 1

  const goPrevStep = () => formSteps > 0 && setFormSteps((prev) => prev - 1);

  return (
    <>
    <Meta title='Checkout' />
    <div className="form-container">
      <Form noValidate onSubmit={handleSubmit(handleCheckout)}>
        <div
          role="button"
          onClick={goPrevStep}
          className="d-flex justify-items-center align-items-center gap-3 pointer"
        >
          {formSteps > 0 && <BsChevronLeft />}
          <span>
            Step {formSteps + 1} of {MAX_STEPS + 1}
          </span>
        </div>
        {formSteps >= 0 && (
          <section className={formSteps === 0 ? "" : "d-none"}>
            <h1 className="mb-4">Shipping Information</h1>
            <Form.Group className="mb-4">
              <Form.Label>Address</Form.Label>
              <Form.Control
                {...register("address", {
                  required: {
                    value: true,
                    message: "Please enter your address",
                  },
                })}
                placeholder="Enter your address"
                type="text"
              />
              {errors.address?.message && (
                <small>{errors.address?.message}</small>
              )}
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>City</Form.Label>
              <Form.Control
                {...register("city", {
                  required: {
                    value: true,
                    message: "Please enter your city",
                  },
                })}
                placeholder="Enter City"
                type="text"
              />
              {errors.city?.message && <small>{errors.city?.message}</small>}
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Postal Code</Form.Label>
              <Form.Control
                {...register("postalCode", {
                  required: {
                    value: true,
                    message: "Please enter your postal code",
                  },
                })}
                placeholder="Enter postal code"
                type="text"
              />
              {errors.postalCode?.message && (
                <small>{errors.postalCode?.message}</small>
              )}
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Country</Form.Label>
              <Form.Control
                {...register("country", {
                  required: {
                    value: true,
                    message: "Please enter your country",
                  },
                })}
                placeholder="Enter country"
                type="text"
              />
              {errors.country?.message && (
                <small>{errors.country?.message}</small>
              )}
            </Form.Group>
          </section>
        )}

        {formSteps >= 1 && (
          <section className={formSteps === 1 ? "" : "d-none"}>
            <h1 className="mb-4">Payment Method</h1>
            <Form.Group>
              <legend>Select Payment Method</legend>
              <Form.Check
                type="radio"
                id="razorpay"
                label="Razorpay or credit card"
                value='Razorpay'
                {...register('paymentMethod', {
                    required:{
                        value: true,
                        message: "Please select a payment method"
                    }
                })}
              />
               {errors.paymentMethod?.message && (
                <small>{errors.paymentMethod.message}</small>
              )}
            </Form.Group>
          </section>
        )}

        <RenderButton
          formSteps={formSteps}
          setFormSteps={setFormSteps}
          formState={formState}
        />
      </Form>
    </div>
    </>
  );
};

export default CheckoutPage;
