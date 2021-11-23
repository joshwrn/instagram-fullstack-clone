import { gql } from '@apollo/client';

export const CREATE_MESSAGE = gql`
  mutation createMessage($message: String!, $recipientId: ID!) {
    createMessage(message: $message, recipientId: $recipientId) {
      id
      message
      sender {
        id
      }
      recipient {
        id
      }
      date
      seen
    }
  }
`;

export const READ_MESSAGES = gql`
  query readMessages($threadId: ID!) {
    readMessages(threadId: $threadId) {
      id
      message
      sender {
        id
      }
      recipient {
        id
      }
      date
      seen
    }
  }
`;
