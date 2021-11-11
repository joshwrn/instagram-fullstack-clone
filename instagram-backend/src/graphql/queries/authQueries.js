const { gql } = require('apollo-server-express');
const User = require('../../models/user');

const typeDefs = gql`
  type Query {
    getCurrentUser: UserProfile
    checkUsernameExist(username: String!): Boolean
    checkEmailExist(email: String!): Boolean
  }
`;

const resolvers = {
  Query: {
    getCurrentUser: async (root, args, context) => {
      return context.currentUser;
    },
    checkUsernameExist: async (root, { username }) => {
      const check = await User.findOne({ username: username });
      return check ? true : false;
    },
    checkEmailExist: async (root, { email }) => {
      const check = await User.findOne({ email: email });
      return check ? true : false;
    },
  },
};

module.exports = { typeDefs, resolvers };
