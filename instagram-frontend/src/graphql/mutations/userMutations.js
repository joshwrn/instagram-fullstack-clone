import { gql } from '@apollo/client';

export const FOLLOW_USER = gql`
  mutation Mutation($currentUser: ID!, $followedUser: ID!) {
    followUser(currentUser: $currentUser, followedUser: $followedUser) {
      id
    }
  }
`;

export const UNFOLLOW_USER = gql`
  mutation UnfollowUser($currentUser: ID!, $followedUser: ID!) {
    unfollowUser(currentUser: $currentUser, followedUser: $followedUser) {
      id
    }
  }
`;
