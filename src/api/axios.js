import axios from "axios";


const SERVER = 'https://mern-stack-ecommerce-app-code-shop-pro.onrender.com'

const axiosApi = axios.create({
    baseURL: SERVER,
    withCredentials: true,
})

export default axiosApi