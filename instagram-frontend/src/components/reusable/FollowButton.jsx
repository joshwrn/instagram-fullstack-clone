import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { useMutation, useLazyQuery } from '@apollo/client';
import { CHECK_FOLLOWING } from '../../graphql/queries/userQueries';
import {
  FOLLOW_USER,
  UNFOLLOW_USER,
} from '../../graphql/mutations/userMutations';

const FollowButton = ({ Styles, match, currentProfile, handleFollowers }) => {
  const [following, setFollowing] = useState(false);
  const { currentUser } = useAuth();
  let history = useHistory();
  const [checkFollowing, { data, loading, error }] =
    useLazyQuery(CHECK_FOLLOWING);
  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);

  useEffect(() => {
    // need to switch to check signed in user
    if (currentUser && currentUser.id !== match) {
      checkFollowing({ variables: { id: currentUser.id, type: 'following' } });
    }
  }, [currentUser, currentProfile]);

  useEffect(() => {
    if (data) {
      const { findFollowers } = data;
      const following = findFollowers.some((follower) => follower.id === match);
      setFollowing(following);
    }
  }, [data]);

  //+ follow
  const handleFollow = async (e) => {
    e.preventDefault();
    if (!currentUser) return history.push('/sign-up');
    followUser({
      variables: {
        followedUser: currentProfile.id,
      },
    });
    setFollowing(true);
  };

  //+ unfollow
  const handleUnfollow = async (e) => {
    e.preventDefault();
    unfollowUser({
      variables: {
        followedUser: currentProfile.id,
      },
    });
    setFollowing(false);
  };

  const handleLink = (e) => {
    e.preventDefault();
    if (handleFollowers) {
      handleFollowers(e);
    }
    history.push('/settings');
  };

  //+ decides if profile button should be follow, unfollow, or edit
  let button = (
    <button onClick={handleFollow} className={Styles.profileBtn}>
      Follow
    </button>
  );

  if (following) {
    button = (
      <button onClick={handleUnfollow} className={Styles.profileBtn}>
        Unfollow
      </button>
    );
  }

  if (currentUser && currentUser.id === match) {
    button = (
      <button onClick={handleLink} className={Styles.profileBtn}>
        Edit Profile
      </button>
    );
  }

  return <>{button}</>;
};

export default FollowButton;
