import axios from "axios";

const api = axios.create({
  baseURL: "https://project-restaurant-backend.onrender.com/api", // Match backend port
});

export default api;
