const { gql } = require('apollo-server-express');
const User = require('../../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const typeDefs = gql`
  type Token {
    value: String!
  }
  type Mutation {
    login(username: String!, password: String!): Token
    addUser(
      username: String!
      displayName: String!
      email: String!
      password: String!
    ): User
  }
`;

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const resolvers = {
  Mutation: {
    login: async (root, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) throw new Error('User not found');

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new Error('Invalid password');

      const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, {
        expiresIn: 60 * 60 * 24 * 7 * 4,
      });
      return { value: token };
    },
    addUser: async (root, { password, displayName, username, email }) => {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      console.log(password, displayName, username, email);

      const user = new User({
        password: passwordHash,
        bio: `Hi i'm ${displayName}`,
        displayName,
        username,
        email,
        banner:
          'https://instagram-clone-joshwrn.s3.us-west-1.amazonaws.com/images/default/banner.jpeg',
        avatar:
          'https://instagram-clone-joshwrn.s3.us-west-1.amazonaws.com/images/default/avatar.jpg',
      });
      return user.save();
    },
  },
};

module.exports = { typeDefs, resolvers };
