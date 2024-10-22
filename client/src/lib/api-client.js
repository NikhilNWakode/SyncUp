import axios from "axios";

const HOST = "https://syncup-backend.onrender.com" ||"http://localhost:8747";

 const apiClient = axios.create({
    baseURL:HOST ,
});


export  default apiClient;