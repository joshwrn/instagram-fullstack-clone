import { gql } from '@apollo/client';

export const CREATE_MESSAGE = gql`
  mutation createMessage($message: String!, $recipientId: ID!) {
    createMessage(message: $message, recipientId: $recipientId) {
      id
    }
  }
`;

export const READ_MESSAGES = gql`
  mutation readMessages($thread: ID!) {
    readMessages(thread: $thread) {
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
