const { gql } = require('apollo-server-express');
const Post = require('../../models/post');
const Comment = require('../../models/comment');
const mongoose = require('mongoose');

const typeDefs = gql`
  type Mutation {
    addComment(comment: String!, post: ID!, user: ID!): Comment

    deleteComment(commentId: ID!, postId: ID!): Comment
  }
`;

const resolvers = {
  Mutation: {
    addComment: async (root, args) => {
      const comment = new Comment({ ...args });
      const result = await comment.save();
      const post = await Post.findOneAndUpdate(
        { _id: args.post },
        { $push: { comments: result._id } },
        { new: true }
      );
      return comment;
    },
    deleteComment: async (root, args) => {
      const result = await Comment.findByIdAndDelete(args.commentId);
      const user = await Post.findOneAndUpdate(
        { _id: args.postId },
        { $pull: { comments: args.commentId } }
      );
    },
  },
};

module.exports = { typeDefs, resolvers };
