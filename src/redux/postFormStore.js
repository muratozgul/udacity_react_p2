import _ from 'lodash';
import API from '../api';
import { createActions } from './utils';
import { getAllPosts } from './postStore';

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
const nameSpace = 'POST_FORM';
export const actions = createActions([
  'OPEN', 'CLOSE',
  'PROMISE_SUBMIT', 'RESOLVE_SUBMIT', 'REJECT_SUBMIT',
  'DISCARD', 'FIELD_CHANGE'
], nameSpace);

const initialState = {
  visible: false,
  submitting: false,
  submitError: null,
  postData: {
    author: '',
    category: '',
    title: '',
    body: '',
  }
};

/******************************************************************************/
// Action Creators
/******************************************************************************/
export const openForm = () => {
  return { type: actions.OPEN };
};

export const closeForm = () => {
  return { type: actions.CLOSE };
};

export const discardForm = () => {
  return { type: actions.DISCARD };
};

export const submitForm = () => {
  return (dispatch, getState) => {
    dispatch({ type: actions.PROMISE_SUBMIT });
    return API.postComment(getState().postForm.postData)
      .then(res => {
        dispatch({ type: actions.RESOLVE_SUBMIT });
        dispatch(getAllPosts());
      })
      .catch(error => {
        dispatch({ type: actions.REJECT_SUBMIT, error });
      });
  };
};

export const formChange = (field, value) => {
  return {
    type: actions.FIELD_CHANGE, field, value
  };
};

/******************************************************************************/
// Action Handlers
/******************************************************************************/
const handleOpen = (state, action) => {
  return {
    ...state,
    visible: true,
  };
};

const handleClose = (state, action) => {
  return {
    ...state,
    visible: false,
  };
};

const handlePromiseSubmit = (state, action) => {
  return {
    ...state,
    submitting: true,
    submitError: null,
  };
};

const handleResolveSubmit = (state, action) => {
  return { ...initialState };
};

const handleRejectSubmit = (state, action) => {
  return {
    ...state,
    submitting: false,
    submitError: action.error,
  };
};

const handleDiscard = (state, action) => {
  return { ...initialState };
};

const handleFieldChange = (state, action) => {
  const { field, value } = action;
  return {
    ...state,
    postData: {
      ...state.postData,
      [field]: value
    }
  };
};

/******************************************************************************/
// Reducer Function
/******************************************************************************/
const postFormReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.OPEN:
      return handleOpen(state, action);
    case actions.CLOSE:
      return handleClose(state, action);
    case actions.PROMISE_SUBMIT:
      return handlePromiseSubmit(state, action);
    case actions.RESOLVE_SUBMIT:
      return handleResolveSubmit(state, action);
    case actions.REJECT_SUBMIT:
      return handleRejectSubmit(state, action);
    case actions.DISCARD:
      return handleDiscard(state, action);
    case actions.FIELD_CHANGE:
      return handleFieldChange(state, action);
    default:
      return state;
  }
};

export default postFormReducer;