const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Message {
    id: ID!
    message: String!
    thread: MessageThread!
    recipient: User!
    sender: User!
    date: String!
    seen: Boolean!
  }

  type MessageThread {
    id: ID!
    messages: [Message]
    otherUser: User!
    date: String!
  }
`;

module.exports = { typeDefs };
