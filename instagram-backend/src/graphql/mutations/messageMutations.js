const { gql, AuthenticationError } = require('apollo-server');
const { PubSub, withFilter } = require('graphql-subscriptions');
const pubsub = new PubSub();
const { mongoose } = require('mongoose');

const User = require('../../models/user');
const Message = require('../../models/message');
const MessageThread = require('../../models/messageThread');

const typeDefs = gql`
  type Mutation {
    readMessages(thread: ID!): [Message]
    createMessage(message: String!, recipientId: ID!): Message
  }

  type Subscription {
    newMessage: Message!
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

    readMessages: async (root, { thread }, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError('You must be logged in to do that!');
      }
      try {
        const update = await Message.updateMany(
          { thread: thread, seen: false, recipient: context.currentUser.id },
          { $set: { seen: true } }
        );
        const messages = await Message.find({
          thread: thread,
        })
          .sort({ date: -1 })
          .populate('sender')
          .populate('recipient');
        return messages;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['NEW_MESSAGE']),
        (payload, variables, { userId }) => {
          const { sender, recipient, thread } = payload.newMessage;
          // console.log(
          //   'sub?',
          //   (sender._id.toString() === userId.toString() ||
          //     recipient._id.toString() === userId.toString()) &&
          //     thread._id.toString() === variables.thread.toString()
          // );
          return 1 === 1;
        }
      ),
    },
  },
};

module.exports = { resolvers, typeDefs };
