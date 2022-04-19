const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Notification {
    id: ID!
    type: String!
    content: String
    user: User!
    from: User!
    post: Post
    seen: Boolean!
    date: String
  }
`;

module.exports = { typeDefs };
