import { gql } from '@apollo/client';

export const FIND_ALL_USERS = gql`
  query {
    allUsers {
      id
      username
    }
  }
`;

export const FIND_USER_PROFILE = gql`
  query Query($id: ID) {
    findUser(id: $id) {
      displayName
      username
      bio
      avatar
      id
      banner
      posts {
        id
        image
        commentCount
        likeCount
      }
      followingCount
      followerCount
      postCount
    }
  }
`;
