const DEFAULT_SERVER_URL = 'http://localhost:5001';
const DEFAULT_HEADERS = { 'Authorization': 'whatever-you-want' };

const API = {};

export const initializeAPI = (url = DEFAULT_SERVER_URL, options = {}) => {
  const headers = options.headers || DEFAULT_HEADERS;

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
