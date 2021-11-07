// import mutations
const userMutations = require('./mutations/userMutations');
const postMutations = require('./mutations/postMutations');
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
const imageTypes = require('./types/imageTypes');

const typeDefs = [
  userMutations.typeDefs,
  postMutations.typeDefs,
  commentMutations.typeDefs,

  postQueries.typeDefs,
  userQueries.typeDefs,

  userTypes.typeDefs,
  postTypes.typeDefs,
  notificationTypes.typeDefs,
  commentTypes.typeDefs,
  messageTypes.typeDefs,
  imageTypes.typeDefs,
];

const resolvers = [
  userMutations.resolvers,
  postMutations.resolvers,
  commentMutations.resolvers,
  imageMutations.resolvers,

  postQueries.resolvers,
  userQueries.resolvers,
];

module.exports = { typeDefs, resolvers };
