import _ from 'lodash';
import API from '../api';
import { createActions } from './utils';

/*
  id: '6ni6ok3ym7mf1p33lnez',
  timestamp: 1468479767190,
  title: 'Learn Redux in 10 minutes!',
  body: 'Just kidding. It takes more than 10 minutes to learn technology.',
  author: 'thingone',
  category: 'redux',
  voteScore: -5,
  deleted: false
*/

/******************************************************************************/
// Initialization
/******************************************************************************/
const nameSpace = 'POST';
const actions = createActions([
  'UP_VOTE', 'DOWN_VOTE',
  'PROMISE_GET_ALL', 'RESOLVE_GET_ALL', 'REJECT_GET_ALL'
], nameSpace);

const initialState = {
  loading: false,
  loadError: null,
  posts: {}
};

/******************************************************************************/
// Action Creators
/******************************************************************************/
export const getAllPosts = () => {
  return (dispatch, getState) => {
    dispatch({ type: actions.PROMISE_GET_ALL });
    return API.getAllPosts()
      .then(posts => dispatch({ type: actions.RESOLVE_GET_ALL, posts }))
      .catch(error => dispatch({ type: actions.REJECT_GET_ALL, error }));
  };
};

/******************************************************************************/
// Action Handlers
/******************************************************************************/
const handlePromiseGetAll = (state, action) => {
  return { ...state, loading: true, error: null };
};

const handleResolveGetAll = (state, action) => {
  const postsArray = action.posts || [];
  const posts = postsArray.reduce((obj, post) => {
    obj[post.id] = post;
    return obj;
  }, {});
  return { ...state, posts, loading: false };
};

const handleRejectGetAll = (state, action) => {
  const { error } = action;
  return { ...state, error, loading: false };
};

const handleVote = (state, action, change) => {
  const { postId } = action;
  if (_.isObject(state.postId)) {
    const post = state[postId];
    const newPost = { ...post, vote: post.vote + change };
    return { ...state, posts: { ...state.posts, [postId]: newPost } };
  } else {
    return state;
  }
};

/******************************************************************************/
// Reducer Function
/******************************************************************************/
const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.UP_VOTE:
      return handleVote(state, action, 1);
    case actions.DOWN_VOTE:
      return handleVote(state, action, -1);
    case actions.PROMISE_GET_ALL:
      return handlePromiseGetAll(state, action);
    case actions.RESOLVE_GET_ALL:
      return handleResolveGetAll(state, action);
    case actions.REJECT_GET_ALL:
      return handleRejectGetAll(state, action);
    default:
      return state;
  }
};

export default postReducer;
