import Home from "./pages/Home";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import ProductPage from "./pages/ProductPage";
import Cart from "./pages/Cart";
import Singin from "./pages/Singin";
import ProtectedRoute from "./components/ProtectedRoute";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import CheckOutPage from "./pages/CheckOutPage";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import OrdersPage from "./pages/OrdersPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import AllUsersPage from "./pages/AllUsersPage";
import UserEditPage from "./pages/UserEditPage";
import AllProductsPage from "./pages/AllProductsPage";
import CreateProductPage from "./pages/CreateProductPage";
import EditProductPage from "./pages/EditProductPage";
import AllOrdersPage from "./pages/AllOrdersPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="/products/:id" element={<ProductPage />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Singin />} />
      <Route path="/register" element={<SignUp />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout" element={<CheckOutPage />} />
        <Route path="/place-order" element={<PlaceOrderPage />} />
        <Route path="/orders/:orderId" element={<OrdersPage />} />
        <Route path="/paymentsuccess" element={<PaymentSuccessPage />} />
        <Route path="/admin" >
          <Route path="users" element={<AllUsersPage />} />
          <Route path="users/:id/edit" element={<UserEditPage />} />
          <Route path="products" element={<AllProductsPage />} />
          <Route path="product/create" element={<CreateProductPage />} />
          <Route path="product/:id/edit" element={<EditProductPage />} />
          <Route path="orders" element={<AllOrdersPage />} />
        </Route>
      </Route>
    </Route>
  )
);

const App = () => {
  return <RouterProvider router={router} />;
};
export default App;
