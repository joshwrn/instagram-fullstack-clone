import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { LIKE_POST } from '../../graphql/mutations/postMutations';
import { useMutation } from '@apollo/client';

import { IoHeartOutline } from 'react-icons/io5';
import Styles from '../../styles/post/post__sidebar.module.css';

const PostLikeButton = ({ match, currentPost, setTotalLikes }) => {
  const [liked, setLiked] = useState(false);
  const [likePost] = useMutation(LIKE_POST, {
    onError: (err) => {
      console.log(err);
    },
  });
  const { currentUser } = useAuth();
  const history = useHistory();

  const updateLikes = async () => {
    if (currentPost.likes) {
      if (currentPost.likes.some((like) => like.id === currentUser.id)) {
        setLiked(true);
      } else {
        setLiked(false);
      }
    }
  };

  useEffect(() => {
    if (!currentUser || !currentPost) return;
    updateLikes();
  }, [currentUser, currentPost]);

  const handleLike = async () => {
    if (currentUser) {
      if (liked === false) {
        setTotalLikes((prev) => prev + 1);
        setLiked(true);
      } else if (liked === true) {
        setLiked(false);
        setTotalLikes((prev) => prev - 1);
      }
      await likePost({
        variables: {
          id: match.params.postid,
          type: liked ? 'unlike' : 'like',
        },
      });
    } else {
      history.push('/sign-up');
    }
  };

  return (
    <IoHeartOutline
      onClick={handleLike}
      className={liked ? Styles.likedIcon : Styles.likeIcon}
    />
  );
};

export default PostLikeButton;
