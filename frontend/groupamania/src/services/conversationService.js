import http from './httpService'
import config from '../config.json'

export async function getConversations(userId){
    const res = await http.get(`${config.apiEndpoint}/conversation/${userId}`)
    return res.data;
}

export function createConversation(conversation){
    return http.post(`${config.apiEndpoint}/conversation/`, conversation)
}