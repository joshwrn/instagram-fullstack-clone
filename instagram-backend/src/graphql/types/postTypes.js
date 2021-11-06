const { gql } = require('apollo-server');

const typeDefs = gql`
  type ProfilePost {
    id: ID!
    image: String!
    likeCount: Int
    commentCount: Int
  }

  type Post {
    id: ID!
    image: String!
    caption: String
    likes: [User]
    comments: [Comment]
    user: User!
  }
`;

module.exports = { typeDefs };
