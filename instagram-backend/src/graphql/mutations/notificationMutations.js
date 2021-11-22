const { gql } = require('apollo-server-express');
const Notification = require('../../models/notification');

const typeDefs = gql`
  type Mutation {
    readNotifications: [Notification]
  }
`;

const resolvers = {
  Mutation: {
    readNotifications: async (root, args, context) => {
      if (!context.currentUser) {
        throw new Error('You must be logged in to read notifications.');
      }
      // delete notifications older than 7 days
      await Notification.deleteMany({
        user: context.currentUser.id,
        seen: true,
        date: { $lte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) },
      });

      // mark all notifications as read
      await Notification.updateMany(
        { user: context.currentUser.id, seen: false },
        { $set: { seen: true } }
      );

      // return remaining notifications
      const notifications = await Notification.find({
        user: context.currentUser.id,
      })
        .populate('from')
        .populate('post');

      return notifications;
    },
  },
};

module.exports = { resolvers, typeDefs };
