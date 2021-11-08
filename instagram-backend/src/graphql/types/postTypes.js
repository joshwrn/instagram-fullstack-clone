const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type ProfilePost {
    id: ID!
    image: String!
    likeCount: Int
    commentCount: Int
    contentType: String
  }

  type Post {
    id: ID!
    image: String
    caption: String
    likes: [User]
    comments: [Comment]
    user: User
    contentType: String
  }
`;

module.exports = { typeDefs };
