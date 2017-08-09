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

  const voteComment = (commentId, option) => {
    const options = {
      method: 'POST',
      headers: { ...headers, 'content-type': 'application/json' },
      body: JSON.stringify({ option })
    };
    return fetch(`${url}/comments/${commentId}`, options)
      .then(res => res.json());
  };

  API.upVoteComment = (commentId) => {
    return voteComment(commentId, 'upVote');
  };

  API.downVoteComment = (commentId) => {
    return voteComment(commentId, 'downVote');
  };

  const votePost = (postId, option) => {
    const options = {
      method: 'POST',
      headers: { ...headers, 'content-type': 'application/json' },
      body: JSON.stringify({ option })
    };
    return fetch(`${url}/posts/${postId}`, options)
      .then(res => res.json());
  };

  API.upVotePost = (commentId) => {
    return votePost(commentId, 'upVote');
  };

  API.downVotePost = (commentId) => {
    return votePost(commentId, 'downVote');
  };

  Object.freeze(API);
};

export default API;
