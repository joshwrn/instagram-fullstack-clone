import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import HomeCardLike from './HomeCardLike';
import HomeCardComments from './HomeCardComments';
import HomeCardImage from './HomeCardImage';
import HomeCardOverlay from './HomeCardOverlay';

import Styles from '../../styles/home/home__card.module.css';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import {
  IoShareOutline,
  IoChatbubbleOutline,
  IoShareSocialOutline,
} from 'react-icons/io5';

const Card = ({ post }) => {
  const [user, setUser] = useState();
  const [likeState, setLikeState] = useState(post?.likes.length);

  const [modal, setModal] = useState(false);
  const [type, setType] = useState();

  const getModal = (modalType) => {
    modal ? setModal(false) : setModal(true);
    setType(modalType);
  };

  return (
    <>
      {post ? (
        <div className={Styles.card}>
          <div className={Styles.container}>
            {modal && (
              <HomeCardOverlay
                getModal={getModal}
                userID={post.user.id}
                type={type}
                post={post}
              />
            )}
            {/*//+ header */}
            <div className={Styles.header}>
              <Link to={`/profile/${post.user.id}`}>
                <div className={Styles.left}>
                  <img
                    src={`data:${post.user.avatar.contentType};base64,${post.user.avatar.image}`}
                    alt=""
                    className={Styles.avatar}
                  />
                  <div className={Styles.userInfo}>
                    <p className={Styles.displayName}>
                      {post.user.displayName}
                    </p>
                    <p className={Styles.username}>@{post.user.username}</p>
                  </div>
                </div>
              </Link>
              {/*//+ more icon */}
              <div className={Styles.right}>
                <MoreHorizIcon
                  onClick={() => {
                    getModal('follow');
                  }}
                  className={Styles.moreIcon}
                />
              </div>
            </div>
            {/*//+ image */}
            <HomeCardImage
              Styles={Styles}
              postID={post.id}
              userID={post.user.id}
              src={`data:${post.contentType};base64,${post.image}`}
            />
            {/*//+ footer */}
            <div className={Styles.footer}>
              <div className={Styles.firstChild}>
                <div className={Styles.left}>
                  {/*//+ likes button */}
                  <HomeCardLike
                    setLikeState={setLikeState}
                    post={post}
                    userID={post.user.id}
                  />
                  <Link
                    className={Styles.chatLink}
                    to={`/Post/${post.user.id}/${post.id}`}
                  >
                    <IoChatbubbleOutline className={Styles.icon} />
                  </Link>
                  <Link
                    className={Styles.chatLink}
                    to={`/Post/${post.user.id}/${post.id}`}
                  >
                    <IoShareOutline className={Styles.icon} />
                  </Link>
                </div>
                <IoShareSocialOutline
                  className={Styles.icon}
                  onClick={() => {
                    getModal('share');
                  }}
                />
              </div>
              <Link
                className={Styles.imageLink}
                to={`/Post/${post.user.id}/${post.id}`}
              >
                <p className={Styles.likes}>{likeState} likes</p>
              </Link>
              {/*//+ comment section */}
              <HomeCardComments
                Styles={Styles}
                userID={post.user.id}
                post={post}
              />
            </div>
          </div>
          <img
            className={Styles.imageBlur + ' ' + 'blur'}
            src={`data:${post.contentType};base64,${post.image}`}
            alt=""
          />
        </div>
      ) : null}
    </>
  );
};

export default Card;
