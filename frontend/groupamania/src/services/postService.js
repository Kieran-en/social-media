import http from './httpService'
import config from '../config.json'

export async function getPosts({pageParam = 1}){
    const res = await http.get(`${config.apiEndpoint}/post?page=${pageParam}`)
    return res.data;
}

export async function getData(){

}

export async function createPost(post){
    return await http.post(`${config.apiEndpoint}/post`, post)
}

export async function modifyPost(post){
    return await http.put(`${config.apiEndpoint}/post`, post)
}

export async function deletePost(postToDelete){
    return await http.delete(`${config.apiEndpoint}/post/${postToDelete}`)
}

export function getAllPosts() {
  return http.get(`${config.apiEndpoint}/post`);
}

