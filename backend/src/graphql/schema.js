// import mutations
const userMutations = require('./mutations/userMutations');
const commentMutations = require('./mutations/commentMutations');
const postMutations = require('./mutations/postMutations');
const authMutations = require('./mutations/authMutations');
const notificationMutations = require('./mutations/notificationMutations');
const messageMutations = require('./mutations/messageMutations');

// import queries
const userQueries = require('./queries/userQueries');
const postQueries = require('./queries/postQueries');
const authQueries = require('./queries/authQueries');
const messageQueries = require('./queries/messageQueries');

// import subscriptions
const messageSubscriptions = require('./subscriptions/messageSubscriptions');
const notificationSubscriptions = require('./subscriptions/notificationSubscriptions');

// import types
const userTypes = require('./types/userTypes');
const postTypes = require('./types/postTypes');
const notificationTypes = require('./types/notificationTypes');
const commentTypes = require('./types/commentTypes');
const messageTypes = require('./types/messageTypes');

const typeDefs = [
  userMutations.typeDefs,
  commentMutations.typeDefs,
  authMutations.typeDefs,
  postMutations.typeDefs,
  notificationMutations.typeDefs,
  messageMutations.typeDefs,

  postQueries.typeDefs,
  userQueries.typeDefs,
  authQueries.typeDefs,
  messageQueries.typeDefs,

  messageSubscriptions.typeDefs,
  notificationSubscriptions.typeDefs,

  userTypes.typeDefs,
  postTypes.typeDefs,
  notificationTypes.typeDefs,
  commentTypes.typeDefs,
  messageTypes.typeDefs,
];

const resolvers = [
  userMutations.resolvers,
  commentMutations.resolvers,
  postMutations.resolvers,
  authMutations.resolvers,
  notificationMutations.resolvers,
  messageMutations.resolvers,

  postQueries.resolvers,
  userQueries.resolvers,
  authQueries.resolvers,
  messageQueries.resolvers,

  messageSubscriptions.resolvers,
  notificationSubscriptions.resolvers,
];

module.exports = { typeDefs, resolvers };
