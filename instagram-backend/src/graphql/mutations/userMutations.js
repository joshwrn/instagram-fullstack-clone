const { gql, AuthenticationError } = require('apollo-server-express');
const User = require('../../models/user');
const mongoose = require('mongoose');
const createBuffer = require('../../utils/createBuffer.js');
const bcrypt = require('bcrypt');

const typeDefs = gql`
  type Mutation {
    followUser(followedUser: ID!): User
    unfollowUser(followedUser: ID!): User
    editSettings(
      avatar: String
      banner: String
      displayName: String
      bio: String
    ): User
  }
`;

const resolvers = {
  Mutation: {
    followUser: async (root, { followedUser }, context) => {
      const currentUser = context.currentUser.id;
      if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }

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

    unfollowUser: async (root, { followedUser }, context) => {
      const currentUser = context.currentUser.id;
      if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }
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
    editSettings: async (
      root,
      { avatar, banner, displayName, bio },
      context
    ) => {
      if (!context.currentUser) {
        throw new AuthenticationError('not authenticated');
      }
      const user = await User.findById(context.currentUser.id);
      if (avatar) {
        user.avatar = { image: avatar, contentType: 'image/jpeg' };
      }
      if (banner) {
        user.banner = { image: banner, contentType: 'image/jpeg' };
      }
      if (displayName) {
        user.displayName = displayName;
      }
      if (bio) {
        user.bio = bio;
      }
      await user.save();
      return user;
    },
  },
};

module.exports = { typeDefs, resolvers };
