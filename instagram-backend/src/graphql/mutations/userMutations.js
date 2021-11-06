const { gql } = require('apollo-server');
const User = require('../../models/user');
const mongoose = require('mongoose');

const typeDefs = gql`
  type Mutation {
    addUser(
      username: String!
      displayName: String!
      password: String!
      theme: String!
      bio: String!
      avatar: String!
      banner: String!
    ): User
  }
`;

const resolvers = {
  Mutation: {
    addUser: (root, args) => {
      const user = new User({ ...args });
      return user.save();
    },
  },
};

module.exports = { typeDefs, resolvers };
