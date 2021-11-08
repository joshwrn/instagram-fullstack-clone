const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Notification {
    id: ID!
    type: String!
    user: User!
    post: Post!
  }
`;

module.exports = { typeDefs };
