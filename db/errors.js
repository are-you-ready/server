const errors = {
  UNKNOWN_ERROR: {
    code: 10000,
    message: 'Unknown error'
  },
  INVALID_USER_TYPE: {
    code: 10001,
    message: 'Invalid user type'
  },
  USER_NOT_FOUND: {
    code: 10002,
    message: 'User not found'
  },
  USER_ALREADY_EXISTS: {
    code: 10003,
    message: 'User already exists'
  },
  INVALID_GROUP_TYPE: {
    code: 10004,
    message: 'Invalid group type'
  },
  GROUP_NOT_FOUND: {
    code: 10005,
    message: 'Group not found'
  },
  GROUP_ALREADY_EXISTS: {
    code: 10006,
    message: 'Group already exists'
  }
};

module.exports = errors;
module.exports.assert = function assert(err, predicate) {
  return value => (predicate && predicate(value))
    ? Promise.resolve(value)
    : Promise.reject(err);
};
