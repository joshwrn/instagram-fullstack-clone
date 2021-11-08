// import mutations
const userMutations = require('./mutations/userMutations');
const commentMutations = require('./mutations/commentMutations');
const imageMutations = require('./mutations/imageMutations');

// import queries
const userQueries = require('./queries/userQueries');
const postQueries = require('./queries/postQueries');

// import types
const userTypes = require('./types/userTypes');
const postTypes = require('./types/postTypes');
const notificationTypes = require('./types/notificationTypes');
const commentTypes = require('./types/commentTypes');
const messageTypes = require('./types/messageTypes');

const typeDefs = [
  userMutations.typeDefs,
  commentMutations.typeDefs,

  postQueries.typeDefs,
  userQueries.typeDefs,

  userTypes.typeDefs,
  postTypes.typeDefs,
  notificationTypes.typeDefs,
  commentTypes.typeDefs,
  messageTypes.typeDefs,

  imageMutations.typeDefs,
];

const resolvers = [
  userMutations.resolvers,
  commentMutations.resolvers,
  imageMutations.resolvers,

  postQueries.resolvers,
  userQueries.resolvers,
];

module.exports = { typeDefs, resolvers };
