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
const nameSpace = 'COMMENT_FORM';
export const actions = createActions([
  'OPEN_EDIT', 'DISCARD', 'FIELD_CHANGE',
  'PROMISE_SUBMIT', 'RESOLVE_SUBMIT', 'REJECT_SUBMIT'
], nameSpace);

const initialState = {
  newComments: {
    // (post)id: { submitting, submitError, ...commentData }
  },
  editComments: {
    // (comment)id: { submitting, submitError, ...commentData }
  },
};

/******************************************************************************/
// Helpers
/******************************************************************************/
const updateComment = (state, formType, id, data = {}) => {
  if (formType === 'new') {
    return {
      newComments: {
        ...state.newComments,
        [id]: { // postId
          parentId: id,
          ...state.newComments[id],
          ...data
        }
      }
    };
  }
  else if (formType === 'edit') {
    return {
      editComments: {
        ...state.editComments,
        [id]: { // commentId
          ...state.editComments[id],
          ...data
        }
      }
    };
  }
  else {
    throw new Error('comment_form_invalid_form_type');
  }
};

const removeComment = (state, formType, id) => {
  if (formType === 'new') {
    return {
      newComments: { ..._.omit(state.newComments, id) }
    };
  }
  else if (formType === 'edit') {
    return {
      editComments: { ..._.omit(state.editComments, id) }
    };
  }
  else {
    throw new Error('comment_form_invalid_form_type');
  }
};

/******************************************************************************/
// Action Creators
/******************************************************************************/
export const openEditForm = (commentId) => {
  return (dispatch, getState) => {
    const comment = getState().comment.comments[commentId];
    if (_.isObject(comment)) {
      dispatch({ type: actions.OPEN_EDIT, comment });
    }
  };
};

export const discardForm = (formType, id) => {
  return { type: actions.DISCARD, formType, id };
};

export const submitForm = (formType, id) => {
  return (dispatch, getState) => {
    dispatch({ type: actions.PROMISE_SUBMIT, formType, id });
    let promise;
    if (formType === 'edit') {
      const commentData = getState().commentForm.editComments[id];
      promise = API.editComment(_.pick(commentData, ['id', 'body']));
    } else {
      const commentData = getState().commentForm.newComments[id];
      promise = API.createNewComment(commentData);
    }
    return promise.then(res => {
        dispatch({ type: actions.RESOLVE_SUBMIT, formType, id, comment: res });
        dispatch({ type: 'COMMENT::NEW', comment: res });
      })
      .catch(error => {
        dispatch({ type: actions.REJECT_SUBMIT, formType, id, error });
      });
  };
};

export const formChange = (formType, id, field, value) => {
  return {
    type: actions.FIELD_CHANGE, formType, id, field, value
  };
};

/******************************************************************************/
// Action Handlers
/******************************************************************************/
const handleOpenEdit = (state, action) => {
  const { comment } = action;
  return {
    ...state,
    editComments: {
      ...state.editComments,
      [comment.id]: { ...comment }
    }
  };
};

const handleDiscard = (state, action) => {
  const { formType, id } = action;
  return { ...state, ...removeComment(state, formType, id) };
};

const handlePromiseSubmit = (state, action) => {
  const { formType, id } = action;
  return {
    ...state,
    ...updateComment(state, formType, id, { submitting: true, submitError: null })
  };
};

const handleResolveSubmit = (state, action) => {
  const { formType, id } = action;
  return {
    ...state,
    ...removeComment(state, formType, id)
  };
};

const handleRejectSubmit = (state, action) => {
  const { formType, id, error } = action;
  return {
    ...state,
    ...updateComment(state, formType, id, { submitting: false, submitError: error })
  };
};

const handleFieldChange = (state, action) => {
  const { formType, id, field, value } = action;
  return {
    ...state,
    ...updateComment(state, formType, id, { [field]: value })
  }
};

/******************************************************************************/
// Reducer Function
/******************************************************************************/
const commentFormReducer = (state = initialState, action) => {
  switch (action.type) {
    // view
    case actions.OPEN_EDIT:
      return handleOpenEdit(state, action);
    case actions.DISCARD:
      return handleDiscard(state, action);
    // submit
    case actions.PROMISE_SUBMIT:
      return handlePromiseSubmit(state, action);
    case actions.RESOLVE_SUBMIT:
      return handleResolveSubmit(state, action);
    case actions.REJECT_SUBMIT:
      return handleRejectSubmit(state, action);
    // change
    case actions.FIELD_CHANGE:
      return handleFieldChange(state, action);
    default:
      return state;
  }
};

export default commentFormReducer;
