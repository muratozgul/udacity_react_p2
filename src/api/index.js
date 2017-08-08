import { DEFAULT_SERVER_URL, DEFAULT_HEADERS } from './config';
import { getImageUrl } from './avatars';

const API = {};

export const initializeAPI = (url = DEFAULT_SERVER_URL, options = {}) => {
  const headers = options.headers || DEFAULT_HEADERS;

  API.getImageUrl = (userId) => {
    return getImageUrl(userId);
  };

  API.getAllPosts = () => {
    return fetch(`${url}/posts`, { headers })
      .then(res => res.json());
  };

  API.getCommentsForPost = (postId) => {
    return fetch(`${url}/posts/${postId}/comments`, { headers })
      .then(res => res.json());
  };

  Object.freeze(API);
};

export default API;
