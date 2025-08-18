import http from './httpService'
import config from '../config.json'

export async function getMessages(conversationId){
    let res = await http.get(`${config.apiEndpoint}/message/${conversationId}`)
    return res.data;
}

export function createMessage(message){
    return http.post(`${config.apiEndpoint}/message/`, message)
}