const { gql } = require('apollo-server-express');
const User = require('../../models/user');
const mongoose = require('mongoose');
const createBuffer = require('../../utils/createBuffer.js');

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
  }
`;

const resolvers = {
  Mutation: {
    addUser: async (
      root,
      { avatar, banner, bio, theme, password, displayName, username }
    ) => {
      const avatarBuffer = await createBuffer(avatar);
      const bannerBuffer = await createBuffer(banner);

      const user = new User({
        bio,
        theme,
        password,
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
