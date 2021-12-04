const { gql } = require('apollo-server-express');
const Post = require('../../models/post');
const User = require('../../models/user');
const Comment = require('../../models/comment');
const mongoose = require('mongoose');

const typeDefs = gql`
  type ProfilePost {
    id: ID!
    image: String!
    likeCount: Int
    commentCount: Int
  }
  type ProfileFeed {
    posts: [ProfilePost]
    hasMore: Boolean!
  }
  type HomeFeed {
    posts: [Post]
    hasMore: Boolean!
  }
  type CommentFeed {
    comments: [Comment]
    hasMore: Boolean!
  }
  type Query {
    findPost(id: ID!): Post
    findPostComments(id: ID!, limit: Int!, skip: Int!): CommentFeed!
    findProfileFeed(id: ID!, limit: Int!, skip: Int!): ProfileFeed!
    findFeed(limit: Int, cursor: String): HomeFeed!
  }
`;

const resolvers = {
  Query: {
    //+ single post
    findPost: async (root, args) => {
      const result = await Post.findById(args.id)
        .populate('user')
        .populate('likes');
      console.log('result', result);
      return result;
    },
    // get comments for a post
    findPostComments: async (root, { id, skip, limit }) => {
      const result = await Comment.find({ post: id })
        .populate('user')
        .limit(limit + 1)
        .skip(skip)
        .sort({ date: -1 });
      let hasMore = false;
      let comments = result.slice(0, limit);
      if (result.length > limit) {
        hasMore = true;
      }
      return { hasMore: hasMore, comments: comments };
    },
    //+ Profile Feed
    findProfileFeed: async (root, { id, limit, skip }) => {
      const result = await Post.find({ user: id })
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit + 1);
      for (const post of result) {
        const id = mongoose.Types.ObjectId(post._id);
        const postStats = await Post.aggregate([
          { $match: { _id: id } },
          {
            $project: {
              id: 1,
              total_likes: { $size: '$likes' },
              total_comments: { $size: '$comments' },
            },
          },
        ]);
        post.likeCount = postStats[0].total_likes;
        post.commentCount = postStats[0].total_comments;
      }
      const hasMore = result.length > limit;
      const posts = hasMore ? result.slice(0, limit) : result;
      return { hasMore: hasMore, posts: posts };
    },
    //+ Home feed
    findFeed: async (root, { limit, cursor }, context) => {
      if (!context.currentUser) return [];
      const result = await Post.find({
        user: { $in: context.currentUser.following },
        date: { $lt: cursor ? cursor : Date.now() },
      })
        .sort({ date: -1 })
        .limit(limit + 1)
        .populate('user')
        .populate('likes')
        .populate({
          path: 'comments',
          perDocumentLimit: 2,
          options: { sort: { date: -1 } },
          populate: { path: 'user' },
        });
      const hasMore = result.length > limit;
      const posts = hasMore ? result.slice(0, limit) : result;
      return { hasMore: hasMore, posts: posts };
    },
  },
};

module.exports = { typeDefs, resolvers };
