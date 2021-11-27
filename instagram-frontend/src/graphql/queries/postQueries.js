import { gql } from '@apollo/client';

export const FIND_FEED = gql`
  query findFeed($offset: Int, $cursor: String) {
    findFeed(offset: $offset, cursor: $cursor) {
      id
      image
      contentType
      caption
      date
      likes {
        id
      }
      comments {
        comment
        id
        user {
          displayName
          id
        }
      }
      user {
        displayName
        username
        id
        avatar {
          image
          contentType
        }
      }
    }
  }
`;

export const FIND_POST_BY_ID = gql`
  query findPost($id: ID!) {
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
        id
        user {
          displayName
          id
          avatar {
            image
            contentType
          }
        }
        date
      }
      user {
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
