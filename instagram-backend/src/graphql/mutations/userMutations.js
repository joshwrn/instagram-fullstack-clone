const { gql, AuthenticationError } = require('apollo-server-express');
const User = require('../../models/user');
const mongoose = require('mongoose');
const createBuffer = require('../../utils/createBuffer.js');
const bcrypt = require('bcrypt');

const typeDefs = gql`
  type Mutation {
    addUser(
      username: String!
      displayName: String!
      email: String!
      password: String!
    ): User
    followUser(currentUser: ID!, followedUser: ID!): User
    unfollowUser(currentUser: ID!, followedUser: ID!): User
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

    addUser: async (root, { password, displayName, username, email }) => {
      //const avatarBuffer = await createBuffer(avatar);
      //const bannerBuffer = await createBuffer(banner);

      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      console.log(password, displayName, username, email);

      const user = new User({
        password: passwordHash,
        bio: `Hi i'm ${displayName}`,
        displayName,
        username,
        email,
        //avatar: avatarBuffer,
        //banner: bannerBuffer,
      });
      return user.save();
    },
  },
};

module.exports = { typeDefs, resolvers };
