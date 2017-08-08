import _ from 'lodash';

export const createActions = (actionNames, nameSpace) => {
  // example: (['DELETE'], 'POSTS') -> { DELETE: 'POSTS::DELETE' }
  return Object.freeze(actionNames.reduce((obj, key) => {
    obj[key] = _.isString(nameSpace) ? `${nameSpace}::${key}` : key;
    return obj;
  }, {}));
};
