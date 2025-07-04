import axios from "axios";
import { toast } from 'react-toastify';

axios.interceptors.response.use(null, error => {
    const expectedError = 
        error.response &&
        error.response.status >= 400 &&
        error.response.status < 500;

    if(!expectedError){
        toast.error("An unexpected error occured!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    }

    return Promise.reject(error);
});


axios.interceptors.request.use(
    config => {
        // Récupération du token à chaque requête (dynamique)
        const token = localStorage.getItem('token');
        if(token) {
            config.headers.authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default {
    get: axios.get,
    put: axios.put,
    post: axios.post,
    delete: axios.delete
};
