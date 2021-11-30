import React, { useState } from 'react';

import FollowersModal from '../reusable/FollowersModal';
import ImageLoader from '../reusable/ImageLoader';

import stopScroll from '../../functions/stopScroll';

import Styles from '../../styles/profile/profile__sidebar.module.css';

const ProfileSidebar = ({ currentProfile, loaded, currentUser }) => {
  const [openFollowers, setOpenFollowers] = useState(false);
  const [currentTab, setCurrentTab] = useState();

  const handleFollowers = (e) => {
    e.preventDefault();
    const choice = e.target.getAttribute('data-type');
    setCurrentTab(choice);
    openFollowers ? setOpenFollowers(false) : setOpenFollowers(true);
    stopScroll(openFollowers);
  };

  let sidebar;

  if (loaded === false) {
    sidebar = (
      <div className={Styles.sidebar}>
        <div className={Styles.usernames}>
          <ImageLoader
            type="div"
            borderRadius="8px"
            width="160px"
            height="32px"
          />
          <ImageLoader
            type="div"
            borderRadius="8px"
            width="96px"
            height="16px"
            margin="8px 0 0 0"
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <ImageLoader
            type="div"
            borderRadius="8px"
            width="200px"
            height="32px"
            margin="20px 0 0 0"
          />
          <ImageLoader
            type="div"
            borderRadius="8px"
            width="200px"
            height="32px"
            margin="20px 0 0 0"
          />
          <ImageLoader
            type="div"
            borderRadius="8px"
            width="200px"
            height="32px"
            margin="20px 0 0 0"
          />
        </div>
      </div>
    );
  }

  if (loaded === true) {
    sidebar = (
      <div className={Styles.sidebar}>
        <div className={Styles.usernames}>
          <h2 className={Styles.displayName}>{currentProfile.displayName}</h2>
          <h3 className={Styles.username}>@{currentProfile.username}</h3>
        </div>
        <div className={Styles.secondContainer}>
          <div className={Styles.postsContainer}>
            <h3>{currentProfile.postCount}</h3>
            <p className={Styles.posts}>Posts</p>
          </div>
          {/*//+ followers / following */}
          {openFollowers && (
            <FollowersModal
              currentProfile={currentProfile}
              handleFollowers={handleFollowers}
              setOpenFollowers={setOpenFollowers}
              openFollowers={openFollowers}
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              currentUser={currentUser}
            />
          )}
          <div className={Styles.userInfo}>
            <div
              onClick={handleFollowers}
              data-type="following"
              className={Styles.followingContainer}
            >
              <h3 data-type="following"> {currentProfile.followingCount} </h3>
              <p data-type="following" className={Styles.following}>
                Following
              </p>
            </div>
            <div
              data-type="followers"
              onClick={handleFollowers}
              className={Styles.followersContainer}
            >
              <h3 data-type="followers">{currentProfile.followerCount}</h3>
              <p data-type="followers" className={Styles.followers}>
                Followers
              </p>
            </div>
          </div>
        </div>
        <div className={Styles.bio}>
          <h3 className={Styles.bioHeader}>Bio</h3>
          <p className={Styles.bioText}>{currentProfile.bio}</p>
        </div>
      </div>
    );
  }

  return <>{sidebar}</>;
};

export default ProfileSidebar;
