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
      avatar {
        image
        contentType
      }
    }
  }
`;

export const SEARCH_USERS = gql`
  query Query($search: String!) {
    searchUsers(search: $search) {
      id
      username
      displayName
      avatar {
        image
        contentType
      }
    }
  }
`;

export const FIND_USER_PROFILE = gql`
  query Query($id: ID!) {
    findUser(id: $id) {
      displayName
      username
      bio
      avatar {
        image
        contentType
      }
      id
      banner {
        image
        contentType
      }
      posts {
        id
        image
        commentCount
        likeCount
        contentType
      }
      followingCount
      followerCount
      postCount
    }
  }
`;
