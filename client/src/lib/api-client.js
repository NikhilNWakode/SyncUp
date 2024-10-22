import axios from "axios";

const HOST = process.env.VITE_SERVER_URL ||"http://localhost:8747";

 const apiClient = axios.create({
    baseURL:HOST ,
});


export  default apiClient;