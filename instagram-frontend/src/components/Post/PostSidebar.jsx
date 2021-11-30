import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import PostCommentSection from './PostCommentSection';
import PostMenu from './PostMenu';
import PostLikeButton from './PostLikeButton';
import PostCommentBox from './PostCommentBox';

import convertTime from '../../functions/convertTime';

import Styles from '../../styles/post/post__sidebar.module.css';
import Loading from '../../styles/post/post__loading.module.css';
import {
  IoShareOutline,
  IoHeartOutline,
  IoChatbubbleOutline,
  IoSendOutline,
} from 'react-icons/io5';

const PostSidebar = ({
  match,
  loaded,
  handleLoad,
  postUser,
  postUserAvatar,
  currentPost,
  ownPost,
}) => {
  const [addTime, setAddTime] = useState('');
  const [totalLikes, setTotalLikes] = useState(0);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (currentPost) {
      const getCur = convertTime(currentPost.date, Date.now());
      setAddTime(getCur);
      setTotalLikes(currentPost.likes.length);
    }
  }, [currentPost]);

  //!!!!!! loading
  if (!currentPost || !postUser) {
    return (
      <div className={Styles.sidebar}>
        <div className={Styles.top}>
          <div className={Styles.profileContainer}>
            <div className={Styles.imageContainer}>
              <div className={Loading.profileImg + ' ' + 'gradientLoad'} />
            </div>
            <div className={Styles.nameContainer}>
              <div className={Loading.displayName + ' ' + 'gradientLoad'} />
              <div className={Loading.username + ' ' + 'gradientLoad'} />
            </div>
          </div>
          <div className={Styles.captionContainer}>
            <p className={Styles.caption}></p>
          </div>
        </div>
        {/*//+ comments */}
        <PostCommentSection />
        <div className={Styles.footer}>
          <div className={Styles.firstChild}>
            <div className={Styles.left}>
              {/*//+ liked button */}
              <PostLikeButton />
              <IoChatbubbleOutline className={Styles.postIcon} />
              <IoShareOutline className={Styles.postIcon} />
            </div>
            {/*//+ delete menu */}
            <PostMenu />
          </div>
          <div className={Styles.infoContainer}>
            <p className={Styles.likes}>0 likes</p>
          </div>
          {/*//+ comment box */}
          <PostCommentBox IoSendOutline={IoSendOutline} Styles={Styles} />
        </div>
      </div>
    );
  }

  return (
    <div className={Styles.sidebar}>
      <div className={Styles.top}>
        <Link to={`/profile/${match.params.uid}`}>
          <div className={Styles.profileContainer}>
            <div className={Styles.imageContainer}>
              <img
                style={!loaded ? { display: 'none' } : null}
                onLoad={handleLoad}
                src={`data:${postUserAvatar.contentType};base64,${postUserAvatar.image}`}
                alt="avatar"
                className={Styles.profileImg}
              />
              <img
                className={Styles.profileImgBlur}
                style={!loaded ? { display: 'none' } : null}
                src={`data:${postUserAvatar.contentType};base64,${postUserAvatar.image}`}
                alt=""
              />
            </div>
            <div
              className={Styles.nameContainer}
              style={loaded ? { display: 'none' } : null}
            >
              <div className={Loading.displayName + ' ' + 'gradientLoad'} />
              <div className={Loading.username + ' ' + 'gradientLoad'} />
            </div>
            <div
              className={Styles.nameContainer}
              style={!loaded ? { display: 'none' } : null}
            >
              <h2 className={Styles.displayName}>{postUser.displayName}</h2>
              <p className={Styles.username}>@{postUser.username}</p>
            </div>
          </div>
        </Link>
        <div className={Styles.captionContainer}>
          <p className={Styles.caption}>{currentPost.caption}</p>
        </div>
      </div>
      {/*//+ comments */}
      <PostCommentSection
        comments={comments}
        setComments={setComments}
        currentPostId={currentPost.id}
        loaded={loaded}
        ownPost={ownPost}
      />
      <div className={Styles.footer}>
        <div className={Styles.firstChild}>
          <div className={Styles.left}>
            {/*//+ liked button */}
            <PostLikeButton
              Styles={Styles}
              match={match}
              currentPost={currentPost}
              IoHeartOutline={IoHeartOutline}
              setTotalLikes={setTotalLikes}
            />
            <IoChatbubbleOutline className={Styles.postIcon} />
            <IoShareOutline className={Styles.postIcon} />
          </div>
          {/*//+ delete menu */}
          <PostMenu match={match} ownPost={ownPost} currentPost={currentPost} />
        </div>
        <div className={Styles.infoContainer}>
          <p className={Styles.likes}>{totalLikes} likes</p>
          <p className={Styles.time}>{addTime}</p>
        </div>
        {/*//+ comment box */}
        <PostCommentBox
          match={match}
          comments={comments}
          setComments={setComments}
          IoSendOutline={IoSendOutline}
          Styles={Styles}
        />
      </div>
    </div>
  );
};

export default PostSidebar;
