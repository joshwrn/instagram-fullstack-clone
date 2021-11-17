import { gql } from '@apollo/client';

export const ADD_COMMENT = gql`
  mutation Mutation($post: ID!, $comment: String!) {
    addComment(post: $post, comment: $comment) {
      id
    }
  }
`;
