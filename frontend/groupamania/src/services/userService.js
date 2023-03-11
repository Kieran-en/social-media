import http from './httpService'
import config from '../config.json'
import jwtDecode from 'jwt-decode'

const tokenKey = "token"

export async function getUser(id){
    const res = await http.get(`${config.apiEndpoint}/auth/${id}`)
    return res.data
} 

export function signup(userInfo){
    return http.post(`${config.apiEndpoint}/auth/signup`, userInfo)
}

export function modifyUser(userInfo){
    return http.put(`${config.apiEndpoint}/auth/${userInfo.id}`, userInfo)
}

export function login(userInfo){
    return http.post(`${config.apiEndpoint}/auth/login`, userInfo)
}

export function logout(){
    localStorage.removeItem(tokenKey)
}

export function getCurrentUser(){
    try {
        const jwt = localStorage.getItem(tokenKey)
        //console.log(jwtDecode(jwt));
        return jwtDecode(jwt)
        } catch (error) {
        return null
        }
}

export function getJwt(){
    return localStorage.getItem(tokenKey)
}