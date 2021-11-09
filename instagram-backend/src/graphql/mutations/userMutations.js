const { gql } = require('apollo-server-express');
const User = require('../../models/user');
const mongoose = require('mongoose');
const createBuffer = require('../../utils/createBuffer.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const typeDefs = gql`
  scalar Upload
  type Mutation {
    addUser(
      username: String!
      displayName: String!
      password: String!
      theme: String!
      bio: String!
      avatar: Upload!
      banner: Upload!
    ): User
    followUser(currentUser: ID!, followedUser: ID!): User
    unfollowUser(currentUser: ID!, followedUser: ID!): User
  }
`;

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const resolvers = {
  Mutation: {
    followUser: async (root, { currentUser, followedUser }) => {
      console.log(JWT_SECRET_KEY);
      const find = await User.findById(followedUser);

      const check = find.followers.includes(currentUser);
      if (check) throw new Error('User already follows this person.');
      //get currentUser and add followedUser to their following list
      const current = await User.findOneAndUpdate(
        { _id: currentUser },
        { $push: { following: followedUser } },
        { new: true }
      );
      // get followedUser and add currentUser to their followers
      const followed = await User.findOneAndUpdate(
        { _id: followedUser },
        { $push: { followers: currentUser } },
        { new: true }
      );
      return followed;
    },

    unfollowUser: async (root, { currentUser, followedUser }) => {
      const find = await User.findById(followedUser);

      const check = find.followers.includes(currentUser);
      if (!check) throw new Error('User does not follow this person.');

      await User.findOneAndUpdate(
        { _id: currentUser },
        { $pull: { following: followedUser } }
      );
      const unFollowed = await User.findOneAndUpdate(
        { _id: followedUser },
        { $pull: { followers: currentUser } },
        { new: true }
      );
      return unFollowed;
    },

    addUser: async (
      root,
      { avatar, banner, bio, theme, password, displayName, username }
    ) => {
      const avatarBuffer = await createBuffer(avatar);
      const bannerBuffer = await createBuffer(banner);

      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const user = new User({
        bio,
        theme,
        password: passwordHash,
        displayName,
        username,
        avatar: avatarBuffer,
        banner: bannerBuffer,
      });
      return user.save();
    },
  },
};

module.exports = { typeDefs, resolvers };
