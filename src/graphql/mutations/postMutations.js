import { gql } from '@apollo/client';

export const UPLOAD_POST = gql`
  mutation postUpload($file: String!, $caption: String) {
    postUpload(file: $file, caption: $caption) {
      id
      image
      likeCount
      commentCount
    }
  }
`;

export const DELETE_POST = gql`
  mutation Mutation($id: ID!) {
    deletePost(id: $id)
  }
`;

export const LIKE_POST = gql`
  mutation Mutation($id: ID!, $type: String!) {
    likePost(id: $id, type: $type)
  }
`;
