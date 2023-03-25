import axios from "axios";
import { toast } from 'react-toastify';

const token = localStorage.getItem('token')

axios.interceptors.response.use(null, error => {
    const expectedError = 
    error.response &&
    error.response >= 400 &&
    error.response < 500;

    if(!expectedError){
        //console.log('Logging the error', error);
        toast.error("An unexpected error occured!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            })
    }

    return Promise.reject(error)
})


axios.interceptors.request.use(
    config => {
        config.headers.authorization = `Bearer ${token}`;
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
}