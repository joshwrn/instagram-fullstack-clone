const { gql } = require('apollo-server-express');
const { withFilter } = require('graphql-subscriptions');
const { pubsub } = require('./pubSub');

const typeDefs = gql`
  type Subscription {
    newMessage(threadId: ID!): Message!
  }
`;

const resolvers = {
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['NEW_MESSAGE']),
        (payload, variables, { userId }) => {
          const { sender, recipient, thread } = payload.newMessage;
          const check =
            recipient.id === userId && thread.id === variables.threadId;
          return check;
        }
      ),
    },
  },
};

module.exports = { resolvers, typeDefs };
