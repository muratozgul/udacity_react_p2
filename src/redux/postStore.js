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
  'UP_VOTE', 'DOWN_VOTE', 'SET_VOTE',
  'PROMISE_GET', 'RESOLVE_GET', 'REJECT_GET',
  'PROMISE_GET_ALL', 'RESOLVE_GET_ALL', 'REJECT_GET_ALL',
  'SORT',
  'INTENT_DELETE', 'CANCEL_DELETE', 'PROMISE_DELETE', 'RESOLVE_DELETE', 'REJECT_DELETE'
], nameSpace);

const initialState = {
  loading: false,
  error: null,
  posts: {},
  sortBy: ['voteScore', 'timestamp'][0],
  sortOrder: ['asc', 'desc'][1],
  delete: {
    id: null,
    deleting: false,
    error: null
  }
};

/******************************************************************************/
// Action Creators
/******************************************************************************/
export const getAllPosts = () => {
  return (dispatch, getState) => {
    dispatch({ type: actions.PROMISE_GET_ALL });
    return API.getAllPosts()
      .then(posts => {
        return posts.map(post => ({
          ...post,
          thumb: API.getImageUrl(post.author)
        }));
      })
      .then(posts => dispatch({ type: actions.RESOLVE_GET_ALL, posts }))
      .catch(error => dispatch({ type: actions.REJECT_GET_ALL, error }));
  };
};

export const getPost = (postId) => {
  return (dispatch, getState) => {
    dispatch({ type: actions.PROMISE_GET, postId });
    return API.getPost(postId)
      .then(post => {
        return { ...post, thumb: API.getImageUrl(post.author) };
      })
      .then(post => dispatch({ type: actions.RESOLVE_GET, postId, post }))
      .catch(error => {
        dispatch({ type: actions.REJECT_GET, postId, error })
      });
  };
};

export const upVotePost = (postId) => {
  return (dispatch, getState) => {
    dispatch({ type: actions.UP_VOTE, postId, animation: true });
    return API.upVotePost(postId)
      .then(res => {
        dispatch({ type: actions.SET_VOTE, postId, value: res.voteScore });
      })
      .catch(error => {
        dispatch({ type: actions.DOWN_VOTE, postId });
      });
  };
};

export const downVotePost = (postId) => {
  return (dispatch, getState) => {
    dispatch({ type: actions.DOWN_VOTE, postId, animation: true });
    return API.downVotePost(postId)
      .then(res => {
        dispatch({ type: actions.SET_VOTE, postId, value: res.voteScore });
      })
      .catch(error => {
        dispatch({ type: actions.UP_VOTE, postId });
      });
  };
};

export const sortPosts = (field, order) => {
  return { type: actions.SORT, field, order };
};

export const intentDeletePost = (postId) => {
  return { type: actions.INTENT_DELETE, postId };
};

export const confirmDeletePost = (postId, redirect) => {
  return (dispatch, getState) => {
    postId = postId || getState().post.delete.id;
    dispatch({ type: actions.PROMISE_DELETE, postId });
    API.deletePost(postId)
      .then(res => {
        dispatch({ type: actions.RESOLVE_DELETE, postId });
        if (_.isFunction(redirect)) {
          redirect();
        }
      })
      .catch(error => {
        dispatch({ type: actions.REJECT_DELETE, postId, error });
      });
  };
};

export const cancelDeletePost = () => {
  return { type: actions.CANCEL_DELETE };
};

/******************************************************************************/
// Action Handlers
/******************************************************************************/
const handlePromiseGet = (state, action) => {
  const { postId } = action;
  return {
    ...state,
    posts: {
      ...state.posts,
      [postId]: { id: postId, loading: true, error: null }
    }
  };
};

const handleResolveGet = (state, action) => {
  const { postId, post } = action;
  return {
    ...state,
    posts: {
      ...state.posts,
      [postId]: post
    }
  };
};

const handleRejectGet = (state, action) => {
  const { postId, error } = action;
  return {
    ...state,
    posts: {
      ...state.posts,
      [postId]: { id: postId, loading: false, error }
    }
  };
}

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

const handleSetVote = (state, action, value) => {
  const { postId } = action;
  const newScore = value || action.value;
  const post = state.posts[postId];
  if (_.isObject(post) && _.isNumber(newScore)) {
    const newPost = { ...post, voteScore: newScore };
    return { ...state, posts: { ...state.posts, [postId]: newPost } };
  } else {
    return state;
  }
};

const handleUpDownVote = (state, action, change) => {
  const { postId } = action;
  const post = state.posts[postId];
  const scoreChange = change || action.change;
  if (_.isObject(post) && _.isNumber(scoreChange)) {
    const newPost = { ...post, voteScore: post.voteScore + scoreChange };
    return { ...state, posts: { ...state.posts, [postId]: newPost } };
  } else {
    return state;
  }
};

const handleSort = (state, action) => {
  const { field, order } = action;
  return {
    ...state,
    sortBy: field,
    sortOrder: order
  };
};

const handleIntentDelete = (state, action) => {
  return {
    ...state,
    delete: {
      id: action.postId,
      deleting: false,
      error: null
    }
  };
};

const handlePromiseDelete = (state, action) => {
  const { postId } = action;
  return {
    ...state,
    posts: _.omit(state.posts, postId),
    delete: {
      id: postId,
      deleting: true,
      error: null
    }
  };
};

const handleResolveDelete = (state, action) => {
  return {
    ...state,
    delete: {
      id: null,
      deleting: false,
      error: null
    }
  };
};

const handleRejectDelete = (state, action) => {
  return {
    ...state,
    delete: {
      id: action.postId,
      deleting: false,
      error: action.error
    }
  };
};

const handleCancelDelete = (state, action) => {
  return {
    ...state,
    delete: {
      id: null,
      deleting: false,
      error: null
    }
  };
};

/******************************************************************************/
// Reducer Function
/******************************************************************************/
const postReducer = (state = initialState, action) => {
  switch (action.type) {
    // vote
    case actions.UP_VOTE:
      return handleUpDownVote(state, action, 1);
    case actions.DOWN_VOTE:
      return handleUpDownVote(state, action, -1);
    case actions.SET_VOTE:
      return handleSetVote(state, action);
    // get
    case actions.PROMISE_GET:
      return handlePromiseGet(state, action);
    case actions.RESOLVE_GET:
      return handleResolveGet(state, action);
    case actions.REJECT_GET:
      return handleRejectGet(state, action);
    // getAll
    case actions.PROMISE_GET_ALL:
      return handlePromiseGetAll(state, action);
    case actions.RESOLVE_GET_ALL:
      return handleResolveGetAll(state, action);
    case actions.REJECT_GET_ALL:
      return handleRejectGetAll(state, action);
    // sort
    case actions.SORT:
      return handleSort(state, action);
    // delete
    case actions.INTENT_DELETE:
      return handleIntentDelete(state, action);
    case actions.CANCEL_DELETE:
      return handleCancelDelete(state, action);
    case actions.PROMISE_DELETE:
      return handlePromiseDelete(state, action);
    case actions.RESOLVE_DELETE:
      return handleResolveDelete(state, action);
    case actions.REJECT_DELETE:
      return handleRejectDelete(state, action);
    default:
      return state;
  }
};

export default postReducer;
