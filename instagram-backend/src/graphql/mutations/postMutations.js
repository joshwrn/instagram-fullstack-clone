const { gql } = require('apollo-server');
const Post = require('../../models/post');
const User = require('../../models/user');
const mongoose = require('mongoose');

const typeDefs = gql`
  type Mutation {
    addPost(image: String!, caption: String, user: ID!): Post
  }
`;

const resolvers = {
  Mutation: {
    addPost: async (root, args) => {
      const post = new Post({ ...args });
      const result = await post.save();
      const user = await User.findOneAndUpdate(
        { _id: args.user },
        { $push: { posts: result._id } },
        { new: true }
      );
      return result;
    },
  },
};

module.exports = { typeDefs, resolvers };
