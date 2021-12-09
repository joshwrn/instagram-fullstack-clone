const { gql } = require('apollo-server-express');
const User = require('../../models/user');
const Post = require('../../models/post');
const mongoose = require('mongoose');

// returns userProfile type which uses profilePost type

const typeDefs = gql`
  type UserCard {
    id: ID!
    username: String!
    displayName: String!
    followerCount: Int!
    followingCount: Int!
    postCount: Int!
    avatar: String!
    recentPosts: [Post]
  }
  type Query {
    findUser(id: ID!): UserProfile
    findFollowers(id: ID!, type: String!): [UserProfile]
    searchUsers(search: String!): [UserProfile]
    findAllUsers: Int
    findUserCard(id: ID!): UserCard
    suggestedUsers: [UserProfile]
  }
`;

const resolvers = {
  Query: {
    findAllUsers: async (root, args) => {
      return User.collection.countDocuments();
    },
    findFollowers: async (parent, args, context, info) => {
      if (args.type === 'followers') {
        try {
          const user = await User.findById(args.id).populate('followers');
          return user.followers;
        } catch (err) {
          throw err;
        }
      } else if (args.type === 'following') {
        try {
          const user = await User.findById(args.id).populate('following');
          return user.following;
        } catch (err) {
          throw err;
        }
      }
    },
    searchUsers: async (parent, { search }) => {
      try {
        const users = await User.find()
          .or([
            { displayName: { $regex: search, $options: 'i' } },
            { username: { $regex: search, $options: 'i' } },
          ])
          .limit(5);
        return users;
      } catch (err) {
        throw err;
      }
    },
    findUser: async (root, args) => {
      try {
        const result = await User.findById(args.id);
        // convert id to mongoose object, for aggregation
        const id = mongoose.Types.ObjectId(args.id);
        const stats = await User.aggregate([
          { $match: { _id: id } },
          {
            $project: {
              id: 1,
              total_followers: { $size: '$followers' },
              total_following: { $size: '$following' },
              total_posts: { $size: '$posts' },
            },
          },
        ]);
        result.followerCount = stats[0].total_followers;
        result.followingCount = stats[0].total_following;
        result.postCount = stats[0].total_posts;
        return result;
      } catch (error) {
        console.log(error);
      }
    },
    findUserCard: async (root, args) => {
      try {
        const user = await User.findById(args.id);
        const recentPosts = await Post.find({ user: args.id })
          .limit(3)
          .sort({ date: -1 });
        const id = mongoose.Types.ObjectId(args.id);
        const stats = await User.aggregate([
          { $match: { _id: id } },
          {
            $project: {
              id: 1,
              total_followers: { $size: '$followers' },
              total_following: { $size: '$following' },
              total_posts: { $size: '$posts' },
            },
          },
        ]);
        user.followerCount = stats[0].total_followers;
        user.followingCount = stats[0].total_following;
        user.postCount = stats[0].total_posts;
        user.recentPosts = recentPosts;
        return user;
      } catch (err) {
        throw err;
      }
    },
    suggestedUsers: async (root, args, context) => {
      try {
        const user = await User.findById(context.currentUser).populate(
          'following'
        );
        const following = user.following;
        const users = await User.find({
          _id: { $nin: following, $ne: context.currentUser },
        }).limit(3);
        return users;
      } catch (err) {
        throw err;
      }
    },
  },
};

module.exports = { typeDefs, resolvers };
