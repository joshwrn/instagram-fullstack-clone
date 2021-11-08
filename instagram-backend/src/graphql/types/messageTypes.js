const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Message {
    id: ID!
    message: String!
    date: String!
    user: User!
  }

  type MessageThread {
    id: ID!
    messages: [Message]
    user: User!
    date: String!
  }
`;

module.exports = { typeDefs };
