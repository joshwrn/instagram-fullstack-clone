const { gql, AuthenticationError } = require('apollo-server-express');
const MessageThread = require('../../models/messageThread');
const User = require('../../models/user');

const typeDefs = gql`
  type Query {
    getThreads: [MessageThread]
  }
`;

const resolvers = {
  Query: {
    getThreads: async (root, args, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError('You must be logged in to do that!');
      }
      try {
        const threads = await MessageThread.find({
          participants: context.currentUser.id,
        })
          .sort({ date: -1 })
          .populate({
            path: 'messages',
            perDocumentLimit: 1,
            options: { sort: { date: -1 } },
          });
        for (const thread of threads) {
          const find = thread.participants.find(
            (p) => p.toString() !== context.currentUser.id
          );
          const otherUser = await User.findById(find);
          thread.otherUser = otherUser;
        }
        return threads;
      } catch (err) {
        throw err;
      }
    },
  },
};

module.exports = { resolvers, typeDefs };
