import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import LoginButton from './LoginButton';
import FollowersModal from '../reusable/FollowersModal';
import UploadModal from '../reusable/UploadModal';

import stopScroll from '../../functions/stopScroll';
import ImageLoader from '../reusable/ImageLoader';

import { useAuth } from '../../contexts/AuthContext';

import Styles from '../../styles/home/home__sidebar.module.css';
import { IoAddCircleOutline } from 'react-icons/io5';

const Sidebar = ({ setNewPost }) => {
  const { currentUser } = useAuth();
  const [openFollowers, setOpenFollowers] = useState(false);
  const [currentTab, setCurrentTab] = useState('followers');
  const [renderModal, setRenderModal] = useState(false);

  const userProfile = currentUser;

  const handleFollowers = (e) => {
    e.preventDefault();
    const choice = e.target.getAttribute('data-type');
    setCurrentTab(choice);
    openFollowers ? setOpenFollowers(false) : setOpenFollowers(true);
    stopScroll(openFollowers);
  };

  //+ new post modal
  const getModal = (e) => {
    e.preventDefault();
    renderModal ? setRenderModal(false) : setRenderModal(true);
    stopScroll(renderModal);
  };

  return (
    <div className={Styles.sidebar}>
      {currentUser && openFollowers && (
        <FollowersModal
          currentProfile={currentUser}
          handleFollowers={handleFollowers}
          setOpenFollowers={setOpenFollowers}
          openFollowers={openFollowers}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          currentUser={currentUser}
        />
      )}

      {renderModal && (
        <UploadModal setNewPost={setNewPost} getModal={getModal} />
      )}
      <div className={Styles.container}>
        {userProfile && (
          <Link to={`/profile/${userProfile.id}`}>
            <div className={Styles.profileContainer}>
              <div className={Styles.imageContainer}>
                <ImageLoader
                  src={`data:${userProfile.avatar.contentType};base64,${userProfile.avatar.image}`}
                  position="absolute"
                  width="80px"
                  height="80px"
                  cursor="pointer"
                  borderRadius="100%"
                />
                <img
                  className={Styles.profileImgBlur}
                  src={`data:${userProfile.avatar.contentType};base64,${userProfile.avatar.image}`}
                  alt=""
                />
              </div>
              <div className={Styles.nameContainer}>
                <h2 className={Styles.displayName}>
                  {userProfile.displayName}
                </h2>
                <p className={Styles.username}>@{userProfile.username}</p>
              </div>
            </div>
          </Link>
        )}
        {userProfile && (
          <div className={Styles.stats}>
            <div
              onClick={handleFollowers}
              data-type="following"
              className={Styles.statContainer}
            >
              <div data-type="following" className={Styles.stat}>
                <p data-type="following" className={Styles.number}>
                  {userProfile.followingCount}
                </p>
              </div>
              <p data-type="following">Following</p>
            </div>
            <div
              onClick={handleFollowers}
              data-type="followers"
              className={Styles.statContainer}
            >
              <div data-type="followers" className={Styles.stat}>
                <p data-type="followers" className={Styles.number}>
                  {userProfile.followerCount}
                </p>
              </div>
              <p data-type="followers">Followers</p>
            </div>
            <Link
              className={Styles.postsLink}
              to={`/profile/${userProfile.id}`}
            >
              <div className={Styles.statContainer}>
                <div className={Styles.stat}>
                  <p className={Styles.number}>{userProfile.postCount}</p>
                </div>
                <p>Posts</p>
              </div>
            </Link>
            <div onClick={getModal} className={Styles.statContainer}>
              <div className={Styles.stat}>
                <IoAddCircleOutline />
              </div>
              <p>New Post</p>
            </div>
          </div>
        )}
        <LoginButton />
      </div>
    </div>
  );
};

export default Sidebar;
