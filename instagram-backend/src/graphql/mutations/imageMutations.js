const { gql } = require('apollo-server-express');

const mongoose = require('mongoose');
const { GraphQLUpload } = require('graphql-upload');
const createBuffer = require('../../utils/createBuffer.js');

const User = require('../../models/user');
const Post = require('../../models/post');

const typeDefs = gql`
  scalar Upload
  type Mutation {
    imageUpload(caption: String, user: ID!, file: Upload!): Post
  }
`;

const resolvers = {
  Upload: GraphQLUpload,
  Mutation: {
    imageUpload: async (parent, { file, caption, user }) => {
      const imageBuffer = await createBuffer(file);

      const post = new Post({
        image: imageBuffer.image,
        contentType: imageBuffer.contentType,
        caption: caption,
        user: user,
      });
      const result = await post.save();
      const updateUser = await User.findOneAndUpdate(
        { _id: user },
        { $push: { posts: result._id } },
        { new: true }
      );

      return result;
    },
  },
};

module.exports = { resolvers, typeDefs };
