const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    getCurrentUser: UserProfile
  }
`;

const resolvers = {
  Query: {
    getCurrentUser: async (root, args, context) => {
      return context.currentUser;
    },
  },
};

module.exports = { typeDefs, resolvers };
