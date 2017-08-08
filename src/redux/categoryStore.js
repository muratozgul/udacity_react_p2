import { createActions } from './utils';

/******************************************************************************/
// Initialization
/******************************************************************************/
const nameSpace = 'CATEGORY';
const actions = createActions([
  'TEST', 'HELP', 'MURAT'
], nameSpace);

const initialState = {
  filterBy: ''
};

/******************************************************************************/
// Action Handlers
/******************************************************************************/
const handleTest = (state, action) => {
  return Object.assign({}, state, {
    filterBy: action.by
  });
}

/******************************************************************************/
// Reducer Function
/******************************************************************************/
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.TEST:
      return handleTest(state, action);
    default:
      return state
  }
};
