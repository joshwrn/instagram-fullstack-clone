const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type UserImage {
    image: String
    contentType: String
  }
  type User {
    username: String!
    displayName: String!
    email: String!
    password: String!
    theme: String
    bio: String
    avatar: UserImage
    banner: UserImage
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
    avatar: UserImage
    banner: UserImage
    id: ID!
    followerCount: Int
    followingCount: Int
    postCount: Int
    posts: [ProfilePost]
  }
  type CurrentUser {
    username: String!
    displayName: String!
    bio: String
    theme: String
    avatar: UserImage
    banner: UserImage
    id: ID!
    followerCount: Int
    followingCount: Int
    postCount: Int
    notiCount: Int
  }
`;

module.exports = { typeDefs };
