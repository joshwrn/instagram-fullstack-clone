const { gql, AuthenticationError } = require('apollo-server-express');
const MessageThread = require('../../models/messageThread');
const Message = require('../../models/message');
const User = require('../../models/user');

const typeDefs = gql`
  type Query {
    getThreads: [MessageThread]
    readMessages(threadId: ID!): [Message]
  }
`;

const resolvers = {
  Query: {
    readMessages: async (root, { threadId }, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError('You must be logged in to do that!');
      }
      try {
        const update = await Message.updateMany(
          { thread: threadId, seen: false, recipient: context.currentUser.id },
          { $set: { seen: true } }
        );
        const messages = await Message.find({
          thread: threadId,
        })
          .sort({ date: -1 })
          .populate('sender')
          .populate('recipient');
        return messages;
      } catch (err) {
        throw new Error(err);
      }
    },
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
