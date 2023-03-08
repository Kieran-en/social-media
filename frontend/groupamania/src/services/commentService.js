import http from './httpService'
import config from '../config.json'

export async function getComments(){
    const res = await http.get(`${config.apiEndpoint}/comment`)
    console.log(res.data)
    return res.data
} 

export async function createComment(comment){
    return await http.post(`${config.apiEndpoint}/comment`, comment)
}

export async function modifyComment(comment){
    return await http.put(`${config.apiEndpoint}/comment`, comment)
}

export async function deleteComment(comment){
    return await http.delete(`${config.apiEndpoint}/comment`, comment)
}