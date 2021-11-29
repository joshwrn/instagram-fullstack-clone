import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';

import ProfileSidebar from './ProfileSidebar';
import ProfileFeed from './ProfileFeed';
import UploadModal from '../reusable/UploadModal';
import ProfileAvatarModal from './ProfileAvatarModal';
import FollowButton from '../reusable/FollowButton';

import ScrollToTop from '../../functions/ScrollToTop';
import stopScroll from '../../functions/stopScroll';

import { FIND_USER_PROFILE } from '../../graphql/queries/userQueries';
import { useQuery } from '@apollo/client';
import { useAuth } from '../../contexts/AuthContext';

import { IoSendOutline, IoAddOutline } from 'react-icons/io5';
import Styles from '../../styles/profile/profile.module.css';

const Profile = (props) => {
  const [currentProfile, setCurrentProfile] = useState(null);
  const [avatarModal, setAvatarModal] = useState(false);
  const [renderModal, setRenderModal] = useState(false);
  const [newPost, setNewPost] = useState(0);
  const [noPosts, setNoPosts] = useState(false);
  const { match } = props;
  const { currentUser, userProfile } = useAuth();
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState([
    { image: 'avatar', loading: true },
    { image: 'banner', loading: true },
  ]);
  let history = useHistory();
  //+ if the every item in loading is set to false set loaded to true
  useEffect(() => {
    if (currentProfile) {
      if (loading.every((item) => item.loading === false)) {
        setLoaded(true);
      }
    }
  }, [loading]);

  //+ set the target image to be done loading onload
  const handleLoad = (e) => {
    const { alt } = e.target;
    const imgIndex = loading.findIndex((img) => img.image === alt);
    setLoading((old) => [...old], {
      [loading[imgIndex]]: (loading[imgIndex].loading = false),
    });
  };

  //$ graphql get profile data
  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(FIND_USER_PROFILE, {
    variables: {
      id: match.params.uid,
    },
  });

  useEffect(() => {
    if (userData && !userLoading && !userError) {
      setCurrentProfile(userData.findUser);
      console.log(userData);
    }
  }, [userData]);

  //+ when theres a new post update the user profile
  useEffect(() => {
    setNoPosts(false);
    // return getUserObject();
  }, [newPost]);

  useEffect(() => {
    // getUserObject();
    setNoPosts(false);
  }, [match]);

  //+ avatar modal
  const getAvatarModal = (e) => {
    e.preventDefault();
    avatarModal ? setAvatarModal(false) : setAvatarModal(true);
    stopScroll(avatarModal);
  };

  //+ new post modal
  const getModal = (e) => {
    e && e.preventDefault();
    renderModal ? setRenderModal(false) : setRenderModal(true);
    stopScroll(renderModal);
  };

  //+ new message link
  const newMessage = () => {
    if (!userProfile) return history.push('/sign-up');
    history.push(`/messages/${currentProfile.userID}`);
  };

  //+ decides if action button should be post or message
  let actionButton = (
    <button onClick={newMessage} className={Styles.actionBtn}>
      <IoSendOutline className="action-icon" />
    </button>
  );
  if (currentUser?.id === match.params.uid) {
    actionButton = (
      <button onClick={getModal} className={Styles.actionBtn}>
        <IoAddOutline className="action-icon" />
      </button>
    );
  }

  if (!currentProfile) {
    return (
      <div className={Styles.profile}>
        <ScrollToTop />
        {/*//+ banner */}
        <div className={Styles.header}>
          <div
            className={`${Styles.heroLoading} gradientLoad`}
            style={loaded ? { display: 'none' } : null}
          />
        </div>
        <div className={Styles.outer}>
          {/*//+ top bar*/}
          <div className={Styles.topSection}>
            <div className={Styles.imgContainer}>
              <div
                style={loaded ? { display: 'none' } : null}
                className={`${Styles.avatarLoading} gradientLoad`}
              />
            </div>
            <div className={Styles.topRight}>
              <div className={Styles.topIconRow}>
                {/*//+ following button */}
                <FollowButton
                  Styles={Styles}
                  match={match.params.uid}
                  currentProfile={currentProfile}
                />
                {actionButton}
              </div>
              {renderModal && (
                <UploadModal setNewPost={setNewPost} getModal={getModal} />
              )}
            </div>
          </div>
        </div>
        <div className={Styles.inner}>
          {/*//+ sidebar */}
          <ProfileSidebar
            loaded={loaded}
            match={match}
            currentProfile={currentProfile}
            currentUser={currentUser}
          />
          {/*//+ posts */}
          <ProfileFeed
            posts={[]}
            newPost={newPost}
            setLoading={setLoading}
            loading={loading}
            loaded={loaded}
            match={match}
            currentProfile={currentProfile}
            noPosts={noPosts}
            setNoPosts={setNoPosts}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={Styles.profile}>
        <ScrollToTop />
        {/*//+ banner */}
        <div className={Styles.header}>
          <div
            className={`${Styles.heroLoading} gradientLoad`}
            style={loaded ? { display: 'none' } : null}
          />
          <img
            className={Styles.hero}
            src={`data:${currentProfile.banner.contentType};base64,${currentProfile.banner.image}`}
            alt="banner"
            onLoad={handleLoad}
            style={!loaded ? { display: 'none' } : null}
          />
        </div>
        <div className={Styles.outer}>
          {/*//+ top bar*/}
          <div className={Styles.topSection}>
            <div className={Styles.imgContainer}>
              <div
                style={loaded ? { display: 'none' } : null}
                className={`${Styles.avatarLoading} gradientLoad`}
              />
              <img
                onClick={getAvatarModal}
                className={Styles.avatar}
                src={`data:${currentProfile.avatar.contentType};base64,${currentProfile.avatar.image}`}
                alt="avatar"
                onLoad={handleLoad}
                style={!loaded ? { display: 'none' } : null}
              />
              <img
                className={Styles.avatarBlur}
                src={`data:${currentProfile.avatar.contentType};base64,${currentProfile.avatar.image}`}
                alt="blur"
                style={!loaded ? { display: 'none' } : null}
              />
            </div>
            {avatarModal && (
              <ProfileAvatarModal
                getAvatarModal={getAvatarModal}
                src={`data:${currentProfile.avatar.contentType};base64,${currentProfile.avatar.image}`}
              />
            )}
            <div className={Styles.topRight}>
              <div className={Styles.topIconRow}>
                {/*//+ following button */}
                <FollowButton
                  Styles={Styles}
                  match={match.params.uid}
                  currentProfile={currentProfile}
                />
                {actionButton}
              </div>
              {renderModal && (
                <UploadModal setNewPost={setNewPost} getModal={getModal} />
              )}
            </div>
          </div>
        </div>
        <div className={Styles.inner}>
          {/*//+ sidebar */}
          <ProfileSidebar
            loaded={loaded}
            match={match}
            currentProfile={currentProfile}
            currentUser={currentUser}
          />
          {/*//+ posts */}
          <ProfileFeed
            posts={currentProfile.posts}
            newPost={newPost}
            setLoading={setLoading}
            loading={loading}
            loaded={loaded}
            match={match}
            currentProfile={currentProfile}
            noPosts={noPosts}
            setNoPosts={setNoPosts}
          />
        </div>
      </div>
    </>
  );
};

export default Profile;
