const { gql } = require('apollo-server-express');
const User = require('../../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const typeDefs = gql`
  type Query {
    getCurrentUser: User
  }
`;

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const resolvers = {
  Query: {
    getCurrentUser: async (root, args, context) => {
      return context.currentUser;
    },
  },
};

module.exports = { typeDefs, resolvers };
