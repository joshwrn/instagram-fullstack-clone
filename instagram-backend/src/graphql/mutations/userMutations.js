const { gql, AuthenticationError } = require('apollo-server-express');

const User = require('../../models/user');
const Notification = require('../../models/notification');

const { pubsub } = require('../subscriptions/pubSub');

const s3 = require('../../utils/config');
require('dotenv').config();

const typeDefs = gql`
  type Mutation {
    followUser(followedUser: ID!): User
    unfollowUser(followedUser: ID!): User
    editSettings(
      avatar: String
      banner: String
      displayName: String
      bio: String
    ): User
    changeTheme: String
  }
`;

const resolvers = {
  Mutation: {
    followUser: async (root, { followedUser }, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError('not authenticated');
      }
      try {
        const find = await User.findById(followedUser);

        const check = find.followers.includes(context.currentUser.id);
        if (check) throw new Error('User already follows this person.');
        //get currentUser and add followedUser to their following list
        await User.findOneAndUpdate(
          { _id: context.currentUser.id },
          { $push: { following: followedUser } }
        );
        // get followedUser and add currentUser to their followers
        const followed = await User.findOneAndUpdate(
          { _id: followedUser },
          { $push: { followers: context.currentUser.id } },
          { new: true }
        );
        const notify = new Notification({
          user: followedUser,
          type: 'follow',
          from: context.currentUser.id,
          seen: false,
        });
        const savedNotification = await notify.save();
        await savedNotification.populate('user');
        pubsub.publish('NEW_NOTIFICATION', {
          newNotification: savedNotification,
        });
        return followed;
      } catch (e) {
        throw new Error(e);
      }
    },

    unfollowUser: async (root, { followedUser }, context) => {
      const currentUser = context.currentUser.id;
      if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }
      const find = await User.findById(followedUser);

      const check = find.followers.includes(currentUser);
      if (!check) throw new Error('User does not follow this person.');

      await User.findOneAndUpdate(
        { _id: currentUser },
        { $pull: { following: followedUser } }
      );
      const unFollowed = await User.findOneAndUpdate(
        { _id: followedUser },
        { $pull: { followers: currentUser } },
        { new: true }
      );
      return unFollowed;
    },

    editSettings: async (
      root,
      { avatar, banner, displayName, bio },
      context
    ) => {
      if (!context.currentUser) {
        throw new AuthenticationError('not authenticated');
      }
      const user = await User.findById(context.currentUser.id);
      const bucketName = process.env.BUCKETNAME;

      if (avatar) {
        const params = {
          Bucket: bucketName,
          Key: '',
          Body: '',
          ACL: 'public-read',
        };
        const buff = Buffer.from(avatar, 'base64');
        params.Body = buff;

        params.Key = `images/${context.currentUser.id}/avatar.jpeg`;

        // upload the object.
        let imageFile = await s3.upload(params).promise().catch(console.log);
        user.avatar = imageFile.Location;
      }
      if (banner) {
        const params = {
          Bucket: bucketName,
          Key: '',
          Body: '',
          ACL: 'public-read',
        };
        const buff = Buffer.from(banner, 'base64');
        params.Body = buff;

        params.Key = `images/${context.currentUser.id}/banner.jpeg`;

        // upload the object.
        let imageFile = await s3.upload(params).promise().catch(console.log);
        user.banner = imageFile.Location;
      }
      if (displayName) {
        user.displayName = displayName;
      }
      if (bio) {
        user.bio = bio;
      }
      await user.save();
      return user;
    },

    changeTheme: async (root, args, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError('not authenticated');
      }
      try {
        const user = await User.findById(context.currentUser.id);
        console.log(user.theme);
        if (user.theme === 'light') {
          user.theme = 'dark';
        } else if (user.theme === 'dark') {
          user.theme = 'light';
        }
        user.save();
        return user.theme;
      } catch (e) {
        throw new Error(e);
      }
    },
  },
};

module.exports = { typeDefs, resolvers };
