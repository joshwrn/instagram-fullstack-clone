const { gql } = require('apollo-server-express');
const User = require('../../models/user');
const Notification = require('../../models/notification');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const typeDefs = gql`
  type Query {
    getCurrentUser(auth: String): CurrentUser
    checkUsernameExist(username: String!): Boolean
    checkEmailExist(email: String!): Boolean
  }
`;

const resolvers = {
  Query: {
    getCurrentUser: async (root, args, context) => {
      console.log('args.auth', args?.auth);
      if (args.auth) {
        console.log('test');
        const auth = args.auth;
        const decodedToken = jwt.verify(auth, JWT_SECRET_KEY);
        try {
          const result = await User.findById(decodedToken.userId);
          // get noti
          const noti = await Notification.find({
            user: result._id,
            seen: false,
          });
          // convert id to mongoose object, for aggregation
          const id = mongoose.Types.ObjectId(decodedToken.userId);
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
          console.log('wtf');
          result.followerCount = stats[0].total_followers;
          result.followingCount = stats[0].total_following;
          result.postCount = stats[0].total_posts;
          result.notiCount = noti.length;
          console.log('return result', result.displayName);
          return result;
        } catch (error) {
          throw new Error(error);
        }
      }
      if (context.currentUser) {
        console.log('context.currentUser', context.currentUser.displayName);
        return context.currentUser;
      }
    },
    checkUsernameExist: async (root, { username }) => {
      const check = await User.findOne({ username: username });
      return check ? true : false;
    },
    checkEmailExist: async (root, { email }) => {
      const check = await User.findOne({ email: email });
      return check ? true : false;
    },
  },
};

module.exports = { typeDefs, resolvers };
