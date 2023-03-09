import http from './httpService'
import config from '../config.json'
import jwtDecode from 'jwt-decode'

export async function getUser(id){
    const res = await http.get(`${config.apiEndpoint}/auth/${id}`)
    return res.data
} 

export function signup(userInfo){
    return http.post(`${config.apiEndpoint}/auth/signup`, userInfo)
}

export function modifyUser(id, userInfo){
    return http.put(`${config.apiEndpoint}/auth/${id}`, userInfo)
}

export function login(userInfo){
    return http.post(`${config.apiEndpoint}/auth/login`, userInfo)
}

export function logout(){
    localStorage.removeItem('token')
}

export function getCurrentUser(){
    try {
        const jwt = localStorage.getItem('token')
        return jwtDecode(jwt)
        } catch (error) {
        return null
        }
}