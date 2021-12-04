import React from 'react';
import { Link } from 'react-router-dom';

import ImageLoader from '../reusable/ImageLoader';

import { IoHeartOutline, IoChatbubbleOutline } from 'react-icons/io5';
import Styles from '../../styles/profile/profile__card.module.css';

const ProfileCard = ({
  src: base,
  match,
  postId,
  likeCount,
  commentCount,
  index,
  cursorRef,
  feedLength,
}) => {
  return (
    <div className={Styles.card}>
      <div
        ref={index === feedLength - 1 ? cursorRef : null}
        className={Styles.container}
      >
        <Link
          className={Styles.link}
          to={`/post/${match.params.uid}/${postId}`}
        >
          <div className={Styles.overlay}>
            <div className={Styles.icon}>
              <IoHeartOutline /> <p>{likeCount}</p>
            </div>
            <div className={Styles.icon}>
              <IoChatbubbleOutline />
              <p>{commentCount}</p>
            </div>
          </div>
          <ImageLoader src={base} borderRadius="9px" />
        </Link>
      </div>
      <img className={Styles.blur} src={base} alt="" />
    </div>
  );
};

export default ProfileCard;
