import { BsCheck2Circle } from "react-icons/bs";
import {  useSearchParams } from "react-router-dom";
import Meta from "../components/Meta";

const PaymentSuccessPage = () => {
  const searchQuery = useSearchParams()[0];

  const refNumber = searchQuery.get("ref");

 
  return (
    <>
    <Meta title='Payment Success!' />
      <div className="text-center mt-5">
        <BsCheck2Circle size={60} color="green" />
        <h1 className="text-success text-uppercase mt-4">
          Payment Successfull
        </h1>
        <p className="text-uppercase fw-bold mt-4">Ref. No:- {refNumber}</p>
      </div>
    </>
  );
};
export default PaymentSuccessPage;
