import { gql } from '@apollo/client';

export const GET_CURRENT_USER = gql`
  query getCurrentUser($auth: String) {
    getCurrentUser(auth: $auth) {
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
      notiCount
      theme
      id
    }
  }
`;

export const CHECK_USERNAME_EXIST = gql`
  query checkUsernameExist($username: String!) {
    checkUsernameExist(username: $username)
  }
`;

export const CHECK_EMAIL_EXIST = gql`
  query checkEmailExist($email: String!) {
    checkEmailExist(email: $email)
  }
`;
