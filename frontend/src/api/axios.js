import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/"
});

api.interceptors.response.use(
  (response) => {

    // If response contains user info, store it
    if (response.data?.user) {
      const { id, username } = response.data.user;

      localStorage.setItem("userId", id);
      localStorage.setItem("username", username);
    }

    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
