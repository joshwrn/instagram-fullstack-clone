const { gql, AuthenticationError } = require('apollo-server-express');

const mongoose = require('mongoose');
const { GraphQLUpload } = require('graphql-upload');
const createBuffer = require('../../utils/createBuffer.js');

const User = require('../../models/user');
const Post = require('../../models/post');

const typeDefs = gql`
  scalar Upload
  type Mutation {
    postUpload(caption: String, file: String!): Post
    deletePost(id: ID!): String
    likePost(id: ID!, type: String!): String
  }
`;

const resolvers = {
  Upload: GraphQLUpload,
  Mutation: {
    postUpload: async (parent, { file, caption }, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }
      //const imageBuffer = await createBuffer(file);
      const post = new Post({
        image: file,
        contentType: 'image/jpeg',
        caption: caption,
        user: context.currentUser.id,
      });
      const result = await post.save();
      await User.findOneAndUpdate(
        { _id: context.currentUser.id },
        { $push: { posts: result._id } },
        { new: true }
      );

      return result;
    },

    deletePost: async (parent, { id }, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }
      const post = await Post.findById(id);
      if (post.user.toString() !== currentUser.id) {
        throw new AuthenticationError('not authenticated');
      }
      await post.remove();
      await User.findOneAndUpdate(
        { _id: currentUser.id },
        { $pull: { posts: id } }
      );
      return 'success';
    },
    likePost: async (parent, { id, type }, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }
      if (type === 'like') {
        const post = await Post.findById(id);
        if (post.likes.includes(currentUser.id)) {
          throw new AuthenticationError('already liked');
        }
        await Post.findByIdAndUpdate(id, {
          $push: { likes: currentUser.id },
        });
      } else if (type === 'unlike') {
        await Post.findByIdAndUpdate(id, {
          $pull: { likes: currentUser.id },
        });
      }
      return 'success';
    },
  },
};

module.exports = { resolvers, typeDefs };
