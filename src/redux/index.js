import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import postReducer from './postStore';

export const initializeStore = () => {
  return createStore(combineReducers({
    post: postReducer
  }), applyMiddleware(thunk));
};
