import { gql } from '@apollo/client';

export const FIND_ALL_USERS = gql`
  query {
    findAllUsers
  }
`;

export const CHECK_FOLLOWING = gql`
  query Query($id: ID!, $type: String!) {
    findFollowers(id: $id, type: $type) {
      id
    }
  }
`;

export const FIND_FOLLOWERS = gql`
  query Query($id: ID!, $type: String!) {
    findFollowers(id: $id, type: $type) {
      id
      username
      displayName
      avatar
    }
  }
`;

export const SEARCH_USERS = gql`
  query Query($search: String!) {
    searchUsers(search: $search) {
      id
      username
      displayName
      avatar
    }
  }
`;

export const FIND_USER_PROFILE = gql`
  query findUser($id: ID!) {
    findUser(id: $id) {
      displayName
      username
      bio
      avatar
      id
      banner
      followingCount
      followerCount
      postCount
    }
  }
`;

export const FIND_USER_CARD = gql`
  query findUserCard($id: ID!) {
    findUserCard(id: $id) {
      id
      displayName
      username
      avatar
      followingCount
      followerCount
      postCount
      recentPosts {
        image
        id
      }
    }
  }
`;
