import http from './httpService'
import config from '../config.json'
import jwtDecode from 'jwt-decode'

const tokenKey = "token"

export async function getUser(name){
    const res = await http.get(`${config.apiEndpoint}/auth/${name}`)
    return res.data
} 

export async function getRole(role){
    const res = await http.get(`${config.apiEndpoint}/auth/${role}`)
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
    return res.data
}

export function modifyUser(userInfo){
    return http.put(`${config.apiEndpoint}/auth/${userInfo.get('id')}`, userInfo, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export async function login(userInfo){
    const res = await http.post(`${config.apiEndpoint}/auth/login`, userInfo)
    return res.data
}

export function logout(){
    localStorage.removeItem(tokenKey)
}

export function getCurrentUser(jwt){
    try {
       // const jwt = localStorage.getItem(tokenKey)
        return jwtDecode(jwt)
        } catch (error) {
        return null
        }
}

export async function getFriends(userToGetFriends){
    const res = await http.get(`${config.apiEndpoint}/auth/friends/${userToGetFriends}`)
    return res.data.following_user_id;
}

export function getJwt(){
    return localStorage.getItem(tokenKey)
}