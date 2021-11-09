import { gql } from '@apollo/client';

export const GET_CURRENT_USER = gql`
  query Query {
    getCurrentUser {
      username
      avatar {
        image
        contentType
      }
    }
  }
`;
