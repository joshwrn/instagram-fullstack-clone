const { gql } = require('apollo-server-express');
const Post = require('../../models/post');
const Comment = require('../../models/comment');
const User = require('../../models/user');
const Notification = require('../../models/notification');
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
      try {
        const newComment = new Comment({
          post: post,
          user: context.currentUser.id,
          comment: comment.trim(),
        });
        const result = await newComment.save();
        const updatedPost = await Post.findOneAndUpdate(
          { _id: post },
          { $push: { comments: result._id } },
          { new: true }
        );
        const noti = new Notification({
          user: updatedPost.user,
          post: updatedPost._id,
          type: 'comment',
          content: comment.trim(),
          from: context.currentUser.id,
          seen: false,
        });
        const saveNoti = await noti.save();
        await User.findByIdAndUpdate(updatedPost.user, {
          $push: { notifications: saveNoti._id },
        });
        return result;
      } catch (err) {
        throw new Error(err);
      }
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
