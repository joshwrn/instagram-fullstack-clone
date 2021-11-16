const { gql } = require('apollo-server-express');
const Post = require('../../models/post');
const mongoose = require('mongoose');

const typeDefs = gql`
  type Query {
    findPost(id: ID!): Post
  }
`;

const resolvers = {
  Query: {
    findPost: async (root, args) => {
      const result = await Post.findOne({ id: args.id })
        .populate('user')
        .populate('likes')
        .populate({
          path: 'comments',
          limit: 10,
          options: { sort: { date: -1 } },
          populate: {
            path: 'user',
          },
        });
      return result;
    },
  },
};

module.exports = { typeDefs, resolvers };
