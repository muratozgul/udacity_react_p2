import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import postReducer from './postStore';
import commentReducer from './commentStore';

export const initializeStore = () => {
  return createStore(combineReducers({
    post: postReducer,
    comment: commentReducer
  }), applyMiddleware(thunk));
};
