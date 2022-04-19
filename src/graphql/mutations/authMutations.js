import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export const SIGN_UP = gql`
  mutation addUser(
    $username: String!
    $displayName: String!
    $password: String!
    $email: String!
  ) {
    addUser(
      username: $username
      displayName: $displayName
      password: $password
      email: $email
    ) {
      email
    }
  }
`;
