import { gql } from '@apollo/client';

export const READ_NOTIFICATIONS = gql`
  mutation readNotifications {
    readNotifications {
      id
      seen
      date
      content
      type
      post {
        id
        image
      }
      from {
        id
        displayName
        avatar
      }
    }
  }
`;
