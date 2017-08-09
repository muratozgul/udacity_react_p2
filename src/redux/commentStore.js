import _ from 'lodash';
import API from '../api';
import { createActions } from './utils';

/*
  author: "thingtwo",
  body: "Hi there! I am a COMMENT.",
  deleted: false,
  id: "894tuq4ut84ut8v4t8wun89g",
  parentDeleted: false,
  parentId: "8xf0y6ziyjabvozdd253nd",
  timestamp: 1468166872634,
  voteScore: 6

  thumb: 'link'
*/

/******************************************************************************/
// Initialization
/******************************************************************************/
const nameSpace = 'COMMENT';
const actions = createActions([
  'UP_VOTE', 'DOWN_VOTE', 'SET_VOTE',
  'PROMISE_GET', 'RESOLVE_GET', 'REJECT_GET'
], nameSpace);

const initialState = {
  comments: {},
  postIdMap: {}
};

/******************************************************************************/
// Action Creators
/******************************************************************************/
export const getCommentsForPost = (postId) => {
  return (dispatch, getState) => {
    dispatch({ type: actions.PROMISE_GET, postId });
    return API.getCommentsForPost(postId)
      .then(comments => {
        return comments.map(comment => ({
          ...comment,
          thumb: API.getImageUrl(comment.author)
        }));
      })
      .then(comments => dispatch({ type: actions.RESOLVE_GET, postId, comments }))
      .catch(error => dispatch({ type: actions.REJECT_GET, postId, error }));
  };
};

export const upVoteComment = (commentId) => {
  return (dispatch, getState) => {
    dispatch({ type: actions.UP_VOTE, commentId, animation: true });
    return API.upVoteComment(commentId)
      .then(res => {
        dispatch({ type: actions.SET_VOTE, commentId, value: res.voteScore });
      })
      .catch(error => {
        dispatch({ type: actions.DOWN_VOTE, commentId });
      });
  };
};

export const downVoteComment = (commentId) => {
  return (dispatch, getState) => {
    dispatch({ type: actions.DOWN_VOTE, commentId, animation: true });
    return API.downVoteComment(commentId)
      .then(res => {
        dispatch({ type: actions.SET_VOTE, commentId, value: res.voteScore });
      })
      .catch(error => {
        dispatch({ type: actions.UP_VOTE, commentId });
      });
  };
};

/******************************************************************************/
// Action Handlers
/******************************************************************************/
const handlePromiseGet = (state, action) => {
  const { postId } = action;
  return {
    ...state,
    postIdMap: {
      ...state.postIdMap,
      [postId]: { comments: [], error: null, loading: true }
    }
  };
};

const handleResolveGet = (state, action) => {
  const { postId } = action;
  const commentsArray = action.comments || [];
  const commentIdsArray = [];
  const comments = commentsArray.reduce((obj, comment) => {
    commentIdsArray.push(comment.id);
    obj[comment.id] = comment;
    return obj;
  }, {});
  return {
    ...state,
    comments: { ...state.comments, ...comments },
    postIdMap: {
      ...state.postIdMap,
      [postId]: { comments: commentIdsArray, loading: false }
    }
  };
};

const handleRejectGet = (state, action) => {
  const { postId, error } = action;
  return {
    ...state,
    postIdMap: {
      ...state.postIdMap,
      [postId]: { comments: [], error, loading: false }
    }
  };
};

const handleSetVote = (state, action, value) => {
  const { commentId } = action;
  const newScore = value || action.value;
  const comment = state.comments[commentId];
  if (_.isObject(comment) && _.isNumber(newScore)) {
    const newComment = { ...comment, voteScore: newScore };
    return { ...state, comments: { ...state.comments, [commentId]: newComment } };
  } else {
    return state;
  }
};

const handleUpDownVote = (state, action, change) => {
  const { commentId } = action;
  const comment = state.comments[commentId];
  const scoreChange = change || action.change;
  if (_.isObject(comment) && _.isNumber(scoreChange)) {
    const newComment = { ...comment, voteScore: comment.voteScore + scoreChange };
    return { ...state, comments: { ...state.comments, [commentId]: newComment } };
  } else {
    return state;
  }
};

/******************************************************************************/
// Reducer Function
/******************************************************************************/
const commentReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.UP_VOTE:
      return handleUpDownVote(state, action, 1);
    case actions.DOWN_VOTE:
      return handleUpDownVote(state, action, -1);
    case actions.SET_VOTE:
      return handleSetVote(state, action);
    case actions.PROMISE_GET:
      return handlePromiseGet(state, action);
    case actions.RESOLVE_GET:
      return handleResolveGet(state, action);
    case actions.REJECT_GET:
      return handleRejectGet(state, action);
    default:
      return state;
  }
};

export default commentReducer;
