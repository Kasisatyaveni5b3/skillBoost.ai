import axios from "axios";
const instance = axios.create({
    baseURL:import.meta.REACT_APP_API_URL,
   headers: {
    'Content-Type': 'application/json',
  },
})

export default instance