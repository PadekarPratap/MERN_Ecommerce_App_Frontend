import axios from "axios";


const SERVER = 'http://localhost:8080'

const axiosApi = axios.create({
    baseURL: SERVER,
    withCredentials: true,
})

export default axiosApi