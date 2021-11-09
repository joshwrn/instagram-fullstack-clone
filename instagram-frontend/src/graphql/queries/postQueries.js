import { gql } from '@apollo/client';

export const FIND_POST_BY_ID = gql`
  query Query($id: ID!) {
    findPost(id: $id) {
      id
      image
      contentType
      caption
      likes {
        id
      }
      comments {
        comment
        user {
          username
          avatar {
            image
            contentType
          }
        }
        date
      }
      user {
        username
        avatar {
          image
          contentType
        }
      }
    }
  }
`;
