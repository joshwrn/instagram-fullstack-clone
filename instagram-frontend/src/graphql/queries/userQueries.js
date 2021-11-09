import { gql } from '@apollo/client';

export const FIND_ALL_USERS = gql`
  query {
    findAllUsers
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