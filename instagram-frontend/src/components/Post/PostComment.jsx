import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import convertTime from '../../functions/convertTime';
import ImageLoader from '../reusable/ImageLoader';

import { useAuth } from '../../contexts/AuthContext';
import { useMutation } from '@apollo/client';
import { DELETE_COMMENT } from '../../graphql/mutations/commentMutations';

import Styles from '../../styles/post/post__comment-section.module.css';
import { IoIosTrash } from 'react-icons/io';
import { IoMdTrash } from 'react-icons/io';

const PostComment = ({ comment, user, time, id, ownPost }) => {
  const [addTime, setAddTime] = useState();
  const [deleteComment] = useMutation(DELETE_COMMENT);

  const { currentUser } = useAuth();

  const getTime = () => {
    const currentTime = Date.now();
    const converted = convertTime(time, currentTime);
    setAddTime(converted);
  };

  useEffect(() => {
    getTime();
  }, [time]);

  useEffect(() => {
    console.log(ownPost);
  }, [ownPost]);

  const handleDelete = () => {
    deleteComment({
      variables: {
        commentId: id,
      },
    });
  };

  return (
    <div className={Styles.commentContainer}>
      <div className={Styles.start}>
        <Link to={`/profile/${user.id}`}>
          <ImageLoader
            src={`data:${user.avatar?.contentType};base64,${user.avatar?.image}`}
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
        {(currentUser?.id === user.id || ownPost) && (
          <IoMdTrash onClick={handleDelete} className={Styles.delete} />
        )}
        <p
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
