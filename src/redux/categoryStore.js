import _ from 'lodash';
import { createActions } from './utils';
import API from '../api';

/******************************************************************************/
// Initialization
/******************************************************************************/
const nameSpace = 'CATEGORY';
const actions = createActions([
  'RESOLVE_GET_ALL'
], nameSpace);

const initialState = {
  categories: []
};

/******************************************************************************/
// Action Creators
/******************************************************************************/
export const getAllCategories = () => {
  return (dispatch, getState) => {
    return API.getAllCategories()
      .then(res => res.categories)
      .then(categories => {
        return categories.map(category => {
          return category.name; // path & name is same
        });
      })
      .then(categories => {
        dispatch({ type: actions.RESOLVE_GET_ALL, categories })
      })
      .catch(error => {
        console.log('Failed to get categories:', error);
      });
  };
};

/******************************************************************************/
// Action Handlers
/******************************************************************************/
const handleResolveGetAll = (state, action) => {
  const { categories } = action;
  return { categories };
};

/******************************************************************************/
// Reducer Function
/******************************************************************************/
const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.RESOLVE_GET_ALL:
      return handleResolveGetAll(state, action);
    default:
      return state;
  }
};

export default categoryReducer;
