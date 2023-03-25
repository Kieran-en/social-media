import axios from "axios";

const token = localStorage.getItem('token')
console.log(token)

axios.interceptors.response.use(null, error => {
    const expectedError = 
    error.response &&
    error.response >= 400 &&
    error.response < 500;

    if(!expectedError){
        console.log('Logging the error', error);
        //alert("An unexpected error occured")
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