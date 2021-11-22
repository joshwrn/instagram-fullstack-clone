import { gql } from '@apollo/client';

export const GET_THREADS = gql`
  query getThreads {
    getThreads {
      id
      date
      messages {
        id
        message
        seen
      }
      otherUser {
        id
        username
        displayName
        avatar {
          image
          contentType
        }
      }
    }
  }
`;
