import http from './httpService'
import config from '../config.json'

export async function getPosts(){
    const res = await http.get(`${config.apiEndpoint}/post?page=1`)
    return res.data;
} 

export async function createPost(post){
    return await http.post(`${config.apiEndpoint}/postt`, post)
}

export async function modifyPost(post){
    return await http.put(`${config.apiEndpoint}/post`, post)
}

export async function deletePost(postToDelete){
    return await http.delete(`${config.apiEndpoint}/post/${postToDelete}`)
}