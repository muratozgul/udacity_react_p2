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
*/

/******************************************************************************/
// Initialization
/******************************************************************************/
const nameSpace = 'COMMENT';
const actions = createActions([
  'UP_VOTE', 'DOWN_VOTE', 'SET_VOTE',
  'PROMISE_GET', 'RESOLVE_GET', 'REJECT_GET',
  'NEW',
  'INTENT_DELETE', 'CANCEL_DELETE', 'PROMISE_DELETE', 'RESOLVE_DELETE', 'REJECT_DELETE'
], nameSpace);

const initialState = {
  comments: {},
  postIdMap: {},
  delete: {
    id: null,
    deleting: false,
    error: null
  }
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

export const intentDeleteComment = (commentId) => {
  return { type: actions.INTENT_DELETE, commentId };
};

export const confirmDeleteComment = (commentId) => {
  return (dispatch, getState) => {
    commentId = commentId || getState().comment.delete.id;
    const postId = getState().comment.comments[commentId].parentId;
    dispatch({ type: actions.PROMISE_DELETE, commentId });
    API.deleteComment(commentId)
      .then(res => {
        dispatch({ type: actions.RESOLVE_DELETE, commentId, postId });
      })
      .catch(error => {
        dispatch({ type: actions.REJECT_DELETE, commentId, error });
      });
  };
};

export const cancelDeleteComment = (commentId) => {
  return { type: actions.CANCEL_DELETE };
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

const handleDeleteCommentsForPost = (state, action) => {
  const { postId } = action;
  const commentIds = state.postIdMap[postId];
  return {
    ...state,
    comments: _.omit(state.comments, commentIds),
    postIdMap: _.omit(state.postIdMap, postId)
  };
};

const handleAddComment = (state, action) => {
  const { comment } = action;
  const postId = comment.parentId;
  const existing = !!state.comments[comment.id];
  const commentIdsArray = state.postIdMap[postId].comments;
  return {
    ...state,
    comments: {
      ...state.comments,
      [comment.id]: { ...comment, thumb: API.getImageUrl(comment.author) }
    },
    postIdMap: {
      ...state.postIdMap,
      [postId]: {
        ...state.postIdMap[postId],
        comments: existing ? commentIdsArray : commentIdsArray.concat([comment.id])
      }
    }
  };
};

const handleIntentDelete = (state, action) => {
  return {
    ...state,
    delete: {
      id: action.commentId,
      deleting: false,
      error: null
    }
  };
};

const handlePromiseDelete = (state, action) => {
  const { commentId } = action;
  return {
    ...state,
    posts: _.omit(state.posts, commentId),
    delete: {
      id: commentId,
      deleting: true,
      error: null
    }
  };
};

const handleResolveDelete = (state, action) => {
  const { postId, commentId } = action;
  const commentIds = state.postIdMap[postId].comments;
  return {
    ...state,
    comments: _.omit(state.comments, commentId),
    postIdMap: {
      ...state.postIdMap,
      [postId]: {
        ...state.postIdMap[postId],
        comments: _.without(state.postIdMap[postId].comments, commentId)
      }
    },
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
      id: action.commentId,
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
const commentReducer = (state = initialState, action) => {
  switch (action.type) {
    // vote
    case actions.UP_VOTE:
      return handleUpDownVote(state, action, 1);
    case actions.DOWN_VOTE:
      return handleUpDownVote(state, action, -1);
    case actions.SET_VOTE:
      return handleSetVote(state, action);
    // new
    case actions.NEW:
      return handleAddComment(state, action);
    // get
    case actions.PROMISE_GET:
      return handlePromiseGet(state, action);
    case actions.RESOLVE_GET:
      return handleResolveGet(state, action);
    case actions.REJECT_GET:
      return handleRejectGet(state, action);
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
    // foreign events
    case 'POST::PROMISE_DELETE':
      return handleDeleteCommentsForPost(state, action);
    default:
      return state;
  }
};

export default commentReducer;
