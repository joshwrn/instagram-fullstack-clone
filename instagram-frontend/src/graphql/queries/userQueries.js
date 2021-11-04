import { gql } from '@apollo/client';

export const FIND_ALL_USERS = gql`
  query {
    allUsers {
      id
      username
    }
  }
`;

export const FIND_USER = gql`
  query Query($username: String, $id: ID) {
    findUser(username: $username, id: $id) {
      displayName
      username
      bio
      avatar
      id
      banner
      posts {
        id
        image
      }
      following {
        username
      }
      followers {
        username
      }
    }
  }
`;
