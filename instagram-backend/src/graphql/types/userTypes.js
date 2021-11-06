const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    username: String!
    displayName: String!
    password: String!
    theme: String
    bio: String
    avatar: String
    banner: String
    id: ID!
    posts: [Post]
    notifications: [Notification]
    messages: [MessageThread]
    followers: [User]
    following: [User]
  }
  type UserProfile {
    username: String!
    displayName: String!
    bio: String
    avatar: String
    banner: String
    id: ID!
    followerCount: Int
    followingCount: Int
    postCount: Int
    posts: [ProfilePost]
  }
`;

module.exports = { typeDefs };
