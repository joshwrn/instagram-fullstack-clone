const { gql } = require('apollo-server-express');
const Post = require('../../models/post');
const User = require('../../models/user');
const mongoose = require('mongoose');

const typeDefs = gql`
  type Query {
    findPost(id: ID!): Post
    findFeed: [Post]
  }
`;

const resolvers = {
  Query: {
    findPost: async (root, args) => {
      const result = await Post.findById(args.id)
        .populate('user')
        .populate('likes')
        .populate({
          path: 'comments',
          perDocumentLimit: 10,
          options: { sort: { date: -1 } },
          populate: {
            path: 'user',
          },
        });
      return result;
    },
    findFeed: async (root, args, context) => {
      const result = await Post.find({
        user: { $in: context.currentUser.following },
      })
        .sort({ date: -1 })
        .limit(5)
        .populate('user')
        .populate('likes')
        .populate({
          path: 'comments',
          perDocumentLimit: 2,
          options: { sort: { date: -1 } },
          populate: { path: 'user' },
        });
      return result;
    },
  },
};

module.exports = { typeDefs, resolvers };
