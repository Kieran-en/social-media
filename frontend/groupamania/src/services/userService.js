import http from './httpService'
import config from '../config.json'
import jwtDecode from 'jwt-decode'

const tokenKey = "token"

export async function getUser(name){
    const res = await http.get(`${config.apiEndpoint}/auth/${name}`)
    return res.data
} 

export function signup(userInfo){
    return http.post(`${config.apiEndpoint}/auth/signup`, userInfo)
}

export function follow(data){
    return http.post(`${config.apiEndpoint}/follow`, data)
}

export async function getFollowingCount(followed_user_id, following_user_id){
    const res = await http.get(`${config.apiEndpoint}/follow?followed_user_id=${followed_user_id}&following_user_id=${following_user_id}`)
    console.log(res.data)
    return res.data
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
        return jwtDecode(jwt)
        } catch (error) {
        return null
        }
}

export function getJwt(){
    return localStorage.getItem(tokenKey)
}