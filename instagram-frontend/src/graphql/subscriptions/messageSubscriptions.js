import { gql } from '@apollo/client';

export const NEW_MESSAGE = gql`
  subscription newMessage($threadId: ID!) {
    newMessage(threadId: $threadId) {
      message
      id
      message
      sender {
        id
        avatar {
          image
          contentType
        }
      }
      recipient {
        id
      }
      date
      seen
    }
  }
`;
