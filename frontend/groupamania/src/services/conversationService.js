import http from './httpService'
import config from '../config.json'

export async function getConversations(userId){
    const res = await http.get(`${config.apiEndpoint}/conversation/${userId}`)
    return res.data;
}

export async function getSpecificConversation(senderId, receiverId){
    const res = await http.get(`${config.apiEndpoint}/conversation/${senderId}/${receiverId}`)
    return res.data;
}


export async function createConversation(conversation){
    const res =  http.post(`${config.apiEndpoint}/conversation`, conversation)
    return res.data
}