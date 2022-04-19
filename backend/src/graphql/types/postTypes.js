const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Post {
    id: ID!
    image: String
    imageType: String
    caption: String
    likes: [User]
    comments: [Comment]
    user: User
    date: String
  }
`;

module.exports = { typeDefs };
