import { gql } from '@apollo/client';

export const FIND_POST_BY_ID = gql`
  query Query($id: ID!) {
    findPost(id: $id) {
      id
      image
      caption
      user {
        id
        username
        displayName
        avatar
      }
      likes {
        id
      }
      comments {
        id
        comment
        user {
          id
          avatar
          displayName
        }
        date
      }
    }
  }
`;
