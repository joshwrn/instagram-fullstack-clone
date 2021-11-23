const { gql, AuthenticationError } = require('apollo-server');
const { pubsub } = require('../subscriptions/pubSub');

const Message = require('../../models/message');
const MessageThread = require('../../models/messageThread');

const typeDefs = gql`
  type Mutation {
    createMessage(message: String!, recipientId: ID!): Message
  }
`;

const resolvers = {
  Mutation: {
    createMessage: async (_, { message, recipientId }, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError('Not authenticated');
      }
      try {
        let thread;
        const findThread = await MessageThread.findOne({
          participants: { $all: [context.currentUser.id, recipientId] },
        });
        if (findThread) {
          thread = findThread;
        } else {
          thread = new MessageThread({
            participants: [context.currentUser.id, recipientId],
            messages: [],
          });
        }
        const newMessage = new Message({
          message: message,
          recipient: recipientId,
          sender: context.currentUser._id,
          thread: thread._id,
        });
        const savedMessage = await newMessage.save();
        await savedMessage.populate('sender recipient thread');
        if (!findThread) {
          thread.messages.push(savedMessage);
          await thread.save();
        } else if (findThread) {
          await MessageThread.findOneAndUpdate(
            { _id: thread._id },
            { $push: { messages: savedMessage } }
          );
        }
        pubsub.publish('NEW_MESSAGE', { newMessage: savedMessage });
        return savedMessage;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};

module.exports = { resolvers, typeDefs };
