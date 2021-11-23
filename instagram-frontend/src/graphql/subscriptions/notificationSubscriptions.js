import { gql } from '@apollo/client';

export const NEW_NOTIFICATION = gql`
  subscription newNotification {
    newNotification {
      id
    }
  }
`;
