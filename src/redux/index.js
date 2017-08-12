import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import categoryReducer from './categoryStore';
import postReducer from './postStore';
import commentReducer from './commentStore';
import postFormReducer from './postFormStore';
import commentFormReducer from './commentFormStore';

const reduxDevToolsChromeExtension = (typeof window === 'object')
  && (typeof window.devToolsExtension !== 'undefined')
  ? window.devToolsExtension()
  : f => f;

const createStoreWithMiddleware = compose(
  applyMiddleware(thunk), reduxDevToolsChromeExtension
)(createStore);

export const initializeStore = () => {
  return createStoreWithMiddleware(
    combineReducers({
      post: postReducer,
      comment: commentReducer,
      category: categoryReducer,
      postForm: postFormReducer,
      commentForm: commentFormReducer
    })
  );
};
