const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Post {
    id: ID!
    image: String
    caption: String
    likes: [User]
    comments: [Comment]
    user: User
    date: String
    contentType: String
  }
`;

module.exports = { typeDefs };
