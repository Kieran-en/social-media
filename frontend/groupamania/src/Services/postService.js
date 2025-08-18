import http from './httpService';
import config from '../config.json';

// Pagination (timeline)
export async function getPosts(page = 1) {
  const res = await http.get(`${config.apiEndpoint}/post?page=${page}`);
  return res.data; // { posts, totalPosts, currentPage, totalPages }
}

// Créer un post
export async function createPost(post) {
  return await http.post(`${config.apiEndpoint}/post`, post);
}

// Modifier un post
export async function modifyPost(postId, post) {
  return await http.put(`${config.apiEndpoint}/post/${postId}`, post);
}

// Supprimer un post
export async function deletePost(postToDelete) {
  return await http.delete(`${config.apiEndpoint}/post/${postToDelete}`);
}

// Récupérer TOUS les posts (pour Stats)
export async function getAllPosts() {
  const res = await http.get(`${config.apiEndpoint}/post/all`);
  return res.data; // Array de posts
}
