import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { userDetails } = useSelector((state) => state.user);

  return userDetails ? <Outlet /> : <Navigate to="/" />;
};
export default ProtectedRoute;
