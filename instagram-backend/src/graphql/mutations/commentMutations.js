const { gql } = require('apollo-server-express');
const Post = require('../../models/post');
const Comment = require('../../models/comment');
const mongoose = require('mongoose');

const typeDefs = gql`
  type Mutation {
    addComment(comment: String!, post: ID!): Comment

    deleteComment(commentId: ID!, postId: ID!): Comment
  }
`;

const resolvers = {
  Mutation: {
    addComment: async (root, { post, comment }, context) => {
      if (!context.currentUser) {
        throw new Error('You must be logged in to comment');
      }
      if (comment.trim() === '') {
        throw new Error('You must enter a comment');
      }
      const newComment = new Comment({
        post: post,
        user: context.currentUser.id,
        comment: comment.trim(),
      });
      const result = await newComment.save();
      await Post.findOneAndUpdate(
        { _id: post },
        { $push: { comments: result._id } },
        { new: true }
      );
      return result;
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
