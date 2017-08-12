import uuid from 'uuid/v1';
import { DEFAULT_SERVER_URL, DEFAULT_HEADERS } from './config';
import { getImageUrl } from './avatars';

const API = {};

export const initializeAPI = (url = DEFAULT_SERVER_URL, options = {}) => {
  const headers = options.headers || DEFAULT_HEADERS;

  API.getImageUrl = (userId) => {
    return getImageUrl(userId);
  };

  API.getAllCategories = () => {
    return fetch(`${url}/categories`, { headers })
      .then(res => res.json());
  };

  API.getPost = (postId) => {
    return fetch(`${url}/posts/${postId}`, { headers })
      .then(res => res.json());
  }

  API.getAllPosts = () => {
    return fetch(`${url}/posts`, { headers })
      .then(res => res.json());
  };

  API.deletePost = (postId) => {
    return fetch(`${url}/posts/${postId}`, { method: 'DELETE', headers });
  };

  API.getCommentsForPost = (postId) => {
    return fetch(`${url}/posts/${postId}/comments`, { headers })
      .then(res => res.json());
  };

  API.createNewPost = (postData) => {
    const post = {
      id: uuid(),
      timestamp: Date.now(),
      title: postData.title,
      body: postData.body,
      author: postData.author,
      category: postData.category
    };
    const options = {
      method: 'POST',
      headers: { ...headers, 'content-type': 'application/json' },
      body: JSON.stringify(post)
    };
    return fetch(`${url}/posts`, options)
      .then(res => res.json());
  };

  API.editPost = (postData) => {
    const { id, title, body } = postData;
    const options = {
      method: 'PUT',
      headers: { ...headers, 'content-type': 'application/json' },
      body: JSON.stringify({ title, body })
    };
    return fetch(`${url}/posts/${id}`, options)
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

  API.createNewComment = (commentData) => {
    const comment = {
      id: uuid(),
      timestamp: Date.now(),
      body: commentData.body,
      author: commentData.author,
      parentId: commentData.parentId
    };
    const options = {
      method: 'POST',
      headers: { ...headers, 'content-type': 'application/json' },
      body: JSON.stringify(comment)
    };
    return fetch(`${url}/comments`, options)
      .then(res => res.json());
  };

  API.editComment = (commentData) => {
    const { id, body } = commentData;
    const options = {
      method: 'PUT',
      headers: { ...headers, 'content-type': 'application/json' },
      body: JSON.stringify({ body })
    };
    return fetch(`${url}/comments/${id}`, options)
      .then(res => res.json());
  };

  API.deleteComment = (commentId) => {
    return fetch(`${url}/comments/${commentId}`, { method: 'DELETE', headers });
  };

  Object.freeze(API);
};

export default API;
