import axios from "axios";

const instance = axios.create({
  timeout: 10000,
  // baseURL: '/api/v2'
})

export default instance