const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Comment {
    id: ID!
    comment: String!
    date: String!
    user: User!
    post: Post!
  }
`;

module.exports = { typeDefs };
