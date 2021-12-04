import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import ImageLoader from '../reusable/ImageLoader';
import LoadingIcon from '../reusable/LoadingIcon';

import convertTime from '../../functions/convertTime';

import { useAuth } from '../../contexts/AuthContext';
import { useMutation } from '@apollo/client';
import { DELETE_COMMENT } from '../../graphql/mutations/commentMutations';

import Styles from '../../styles/post/post__comment-section.module.css';

import { IoTrashOutline } from 'react-icons/io5';

const PostComment = ({
  comment,
  user,
  time,
  id,
  ownPost,
  index,
  commentsLength,
  cursorRef,
}) => {
  const [addTime, setAddTime] = useState();
  const [deleteComment, { data, loading, error }] = useMutation(
    DELETE_COMMENT,
    {
      update(cache) {
        const normalizedId = cache.identify({ id, __typename: 'Comment' });
        cache.evict({ id: normalizedId });
        cache.gc();
      },
    }
  );

  const { currentUser } = useAuth();

  const getTime = () => {
    const currentTime = Date.now();
    const converted = convertTime(time, currentTime);
    setAddTime(converted);
  };

  useEffect(() => {
    getTime();
  }, [time]);

  const handleDelete = () => {
    deleteComment({
      variables: {
        commentId: id,
      },
    });
  };

  return (
    <div
      ref={commentsLength === index + 1 ? cursorRef : null}
      className={Styles.commentContainer}
    >
      <div className={Styles.start}>
        <Link to={`/profile/${user.id}`}>
          <ImageLoader
            src={user.avatar}
            width="27px"
            height="27px"
            borderRadius="100%"
          />
        </Link>
        <p className={Styles.comment}>
          <span className={Styles.user}>
            <Link to={`/profile/${user.id}`}>{user.displayName} </Link>
          </span>
          {comment}
        </p>
      </div>
      <div className={Styles.deleteContainer}>
        {(currentUser?.id === user.id || ownPost) && !loading && (
          <IoTrashOutline onClick={handleDelete} className={Styles.delete} />
        )}
        <LoadingIcon loading={loading} size={8} />
        <p
          style={
            loading
              ? {
                  position: 'absolute',
                  opacity: '0',
                }
              : { position: 'relative', opacity: '1' }
          }
          className={
            currentUser?.id === user.id || ownPost
              ? Styles.hideTime
              : Styles.time
          }
        >
          {addTime}
        </p>
      </div>
    </div>
  );
};

export default PostComment;
