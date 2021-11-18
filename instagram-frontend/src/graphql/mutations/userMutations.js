import { gql } from '@apollo/client';

export const FOLLOW_USER = gql`
  mutation Mutation($followedUser: ID!) {
    followUser(followedUser: $followedUser) {
      id
    }
  }
`;

export const UNFOLLOW_USER = gql`
  mutation UnfollowUser($followedUser: ID!) {
    unfollowUser(followedUser: $followedUser) {
      id
    }
  }
`;

export const EDIT_SETTINGS = gql`
  mutation EditSettings(
    $avatar: String
    $banner: String
    $bio: String
    $displayName: String
  ) {
    editSettings(
      avatar: $avatar
      banner: $banner
      bio: $bio
      displayName: $displayName
    ) {
      id
    }
  }
`;
