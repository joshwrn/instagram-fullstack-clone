const { gql, AuthenticationError } = require('apollo-server-express');
const Post = require('../../models/post');
const Comment = require('../../models/comment');
const Notification = require('../../models/notification');

const { pubsub } = require('../subscriptions/pubSub');

const typeDefs = gql`
  type Mutation {
    addComment(comment: String!, post: ID!): Comment
    deleteComment(commentId: ID!, post: ID!): String
  }
`;

const resolvers = {
  Mutation: {
    addComment: async (root, { post, comment }, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError('You must be logged in to comment');
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
        const notify = new Notification({
          user: updatedPost.user,
          post: updatedPost._id,
          type: 'comment',
          content: comment.trim(),
          from: context.currentUser.id,
          seen: false,
        });
        const savedNotification = await notify.save();
        await savedNotification.populate('user');
        console.log('saved', savedNotification);
        pubsub.publish('NEW_NOTIFICATION', {
          newNotification: savedNotification,
        });
        return result;
      } catch (err) {
        throw new Error(err);
      }
    },
    deleteComment: async (root, args, context) => {
      if (context.currentUser) {
        try {
          const check = await Post.findById(args.post);
          if (check.user._id === context.currentUser.id) {
            await Comment.findByIdAndDelete(args.commentId);
            await Post.findOneAndUpdate(
              { _id: args.post },
              { $pull: { comments: args.commentId } }
            );
          } else {
            throw new AuthenticationError('Not your comment');
          }
        } catch (e) {
          throw new Error(e);
        }
        return 'success';
      }
    },
  },
};

module.exports = { typeDefs, resolvers };
