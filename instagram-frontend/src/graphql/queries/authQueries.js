import { gql } from '@apollo/client';

export const GET_CURRENT_USER = gql`
  query Query {
    getCurrentUser {
      username
      banner {
        image
        contentType
      }
      avatar {
        image
        contentType
      }
      displayName
      bio
      followerCount
      followingCount
      postCount
      id
      notifications {
        id
        seen
      }
    }
  }
`;

export const CHECK_USERNAME_EXIST = gql`
  query Query($username: String!) {
    checkUsernameExist(username: $username)
  }
`;

export const CHECK_EMAIL_EXIST = gql`
  query Query($email: String!) {
    checkEmailExist(email: $email)
  }
`;
