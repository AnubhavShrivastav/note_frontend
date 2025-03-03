import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/notes",
});

// Attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("Token");
  if (token) req.headers.Authorization = token;
  return req;
});

export default API;
