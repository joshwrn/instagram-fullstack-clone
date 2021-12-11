import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { useMutation, useLazyQuery } from '@apollo/client';
import { CHECK_FOLLOWING } from '../../graphql/queries/userQueries';
import {
  FOLLOW_USER,
  UNFOLLOW_USER,
} from '../../graphql/mutations/userMutations';

const FollowButton = ({ className, currentProfile, handleFollowers }) => {
  const [following, setFollowing] = useState(false);
  const [text, setText] = useState('Follow');

  const [checkFollowing, { data, loading, error }] =
    useLazyQuery(CHECK_FOLLOWING);
  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);

  const { currentUser } = useAuth();
  let history = useHistory();

  useEffect(() => {
    // need to switch to check signed in user
    if (currentUser && currentUser.id !== currentProfile) {
      checkFollowing({ variables: { id: currentUser.id, type: 'following' } });
    }
  }, [currentUser, currentProfile]);

  useEffect(() => {
    if (data) {
      const { findFollowers } = data;
      const following = findFollowers.some(
        (follower) => follower.id === currentProfile
      );
      setFollowing(following);
    }
  }, [data]);

  //+ follow
  const handleFollow = async (e) => {
    if (!currentUser) return history.push('/sign-up');
    followUser({
      variables: {
        followedUser: currentProfile,
      },
    });
    setFollowing(true);
  };

  //+ unfollow
  const handleUnfollow = async (e) => {
    unfollowUser({
      variables: {
        followedUser: currentProfile,
      },
    });
    setFollowing(false);
  };

  const handleLink = (e) => {
    if (handleFollowers) {
      handleFollowers(e);
    }
    history.push('/settings');
  };

  const handleClick = () => {
    if (following) {
      handleUnfollow();
    } else if (currentUser && currentUser.id === currentProfile) {
      handleLink();
    } else {
      handleFollow();
    }
  };

  useEffect(() => {
    if (following) {
      setText('Unfollow');
    } else {
      setText('Follow');
    }
    if (currentUser && currentUser.id === currentProfile) {
      setText('Edit Profile');
    }
  }, [following, currentUser, currentProfile]);

  return (
    <button className={className} onClick={handleClick}>
      {text}
    </button>
  );
};

export default FollowButton;
