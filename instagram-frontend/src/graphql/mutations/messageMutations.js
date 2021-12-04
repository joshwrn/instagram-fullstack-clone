import { gql } from '@apollo/client';

export const CREATE_MESSAGE = gql`
  mutation createMessage($message: String!, $recipientId: ID!) {
    createMessage(message: $message, recipientId: $recipientId) {
      id
      message
      sender {
        id
        avatar
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
  query readMessages($threadId: ID!, $skip: Int!, $limit: Int!) {
    readMessages(threadId: $threadId, skip: $skip, limit: $limit) {
      hasMore
      messages {
        message
        id
        sender {
          id
          avatar
        }
        recipient {
          id
        }
        date
        seen
      }
    }
  }
`;
