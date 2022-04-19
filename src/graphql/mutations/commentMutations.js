import { gql } from '@apollo/client';

export const ADD_COMMENT = gql`
  mutation addComment($post: ID!, $comment: String!) {
    addComment(post: $post, comment: $comment) {
      id
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation Mutation($commentId: ID!) {
    deleteComment(commentId: $commentId)
  }
`;
