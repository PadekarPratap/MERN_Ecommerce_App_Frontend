import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const RootLayout = () => {
  return (
    <div className="d-flex flex-column justify-content-between main">
    <Header />
    <Container className="flex-grow-1">
      <main className="mt-3">
        <Outlet />
      </main>
      <ToastContainer autoClose={2000} />
    </Container>
    <Footer />
  </div>
  )
}
export default RootLayout