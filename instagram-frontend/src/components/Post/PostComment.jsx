import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import convertTime from '../../functions/convertTime';
import ImageLoader from '../reusable/ImageLoader';

import Styles from '../../styles/post/post__comment-section.module.css';

const PostComment = ({ comment, user, time }) => {
  const [addTime, setAddTime] = useState();

  const getTime = () => {
    const currentTime = Date.now();
    const converted = convertTime(time, currentTime);
    setAddTime(converted);
  };

  useEffect(() => {
    getTime();
  }, [time]);

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
      <p className={Styles.time}>{addTime}</p>
    </div>
  );
};

export default PostComment;
