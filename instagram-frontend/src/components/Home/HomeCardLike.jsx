import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import { useAuth } from '../../contexts/AuthContext';

import { useMutation } from '@apollo/client';
import { LIKE_POST } from '../../graphql/mutations/postMutations';

import styled from 'styled-components';
import { IoHeartOutline } from 'react-icons/io5';

const HomeCardLike = ({ post, setLikeState }) => {
  const [liked, setLiked] = useState(false);
  const { currentUser } = useAuth();
  let history = useHistory();
  const [likePost] = useMutation(LIKE_POST, {
    onError: (err) => {
      console.log(err);
    },
  });

  useEffect(() => {
    if (!post || !currentUser) return;
    if (post.likes.some((like) => like.id === currentUser.id)) {
      setLiked(true);
    }
  }, [post]);

  const handleLike = async () => {
    if (!currentUser) {
      return history.push('/sign-up');
    }
    if (currentUser) {
      if (liked) {
        setLiked(false);
        setLikeState((prev) => prev - 1);
        await likePost({
          variables: {
            id: post.id,
            type: 'unlike',
          },
        });
      } else {
        setLiked(true);
        setLikeState((prev) => prev + 1);
        await likePost({
          variables: {
            id: post.id,
            type: 'like',
          },
        });
      }
    }
  };

  return <HeartIcon liked={liked} onClick={handleLike} />;
};

const HeartIcon = styled(IoHeartOutline)`
  margin: 0 7px 0 0;
  cursor: pointer;
  path {
    &:hover {
      fill: red;
      stroke: red;
    }
    fill: ${({ liked }) => liked && 'red'};
    stroke: ${({ liked }) => liked && 'red'};
  }
`;

export default HomeCardLike;
