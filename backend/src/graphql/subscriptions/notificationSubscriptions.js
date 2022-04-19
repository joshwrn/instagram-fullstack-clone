const { gql } = require('apollo-server-express');
const { withFilter } = require('graphql-subscriptions');
const { pubsub } = require('./pubSub');

const typeDefs = gql`
  type Subscription {
    newNotification: Notification!
  }
`;

const resolvers = {
  Subscription: {
    newNotification: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['NEW_NOTIFICATION']),
        (payload, variables, { userId }) => {
          const { user } = payload.newNotification;
          const check = user.id === userId;
          return check;
        }
      ),
    },
  },
};

module.exports = { typeDefs, resolvers };
