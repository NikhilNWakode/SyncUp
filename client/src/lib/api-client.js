import axios from "axios";

const HOST = "http://localhost:8747";

 const apiClient = axios.create({
    baseURL:HOST ,
});


export  default apiClient;