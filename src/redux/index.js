import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import categoryReducer from './categoryStore';
import postReducer from './postStore';
import commentReducer from './commentStore';
import postFormReducer from './postFormStore';

export const initializeStore = () => {
  return createStore(combineReducers({
    post: postReducer,
    comment: commentReducer,
    category: categoryReducer,
    postForm: postFormReducer
  }), applyMiddleware(thunk));
};
