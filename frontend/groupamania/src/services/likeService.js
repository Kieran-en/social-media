import http from './httpService'
import config from '../config.json'

export async function like(like){
    const res = await http.post(`${config.apiEndpoint}/like`, like)
    return res
}

export async function getNumLikes(id){
    const res = await http.get(`${config.apiEndpoint}/like/${id}`)
    return res.data
}

export async function isPostLiked(userId, postId){
    const res = await http.get(`${config.apiEndpoint}/like/postLiked/?userId=${userId}&postId=${postId}`)
    return res.data
}