import http from './httpService'
import config from '../config.json'

export async function like(like){
    return await http.post(`${config.apiEndpoint}/like`, like)
}

export async function getNumLikes(id){
    const res = await http.get(`${config.apiEndpoint}/like/${id}`)
    return res.data
}

export async function isPostLiked(data){
    return await http.post(`${config.apiEndpoint}/like/postLiked`, data)
}