import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';

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
import styled from 'styled-components';

const Profile = (props) => {
  const [currentProfile, setCurrentProfile] = useState(null);
  const [avatarModal, setAvatarModal] = useState(false);
  const [renderModal, setRenderModal] = useState(false);

  const { match } = props;
  const params = useParams();
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
    <ActionButton
      onClick={currentUser?.id === params.uid ? getModal : newMessage}
    >
      {currentUser?.id === params.uid ? (
        <IoAddOutline className="action-icon" />
      ) : (
        <IoSendOutline className="action-icon" />
      )}
    </ActionButton>
  );

  //! no profile found
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
                <StyledFollowButton as={FollowButton} Styles={Styles} />
                {actionButton}
              </div>
            </div>
          </div>
        </div>
        <div className={Styles.inner}>
          {/*//+ sidebar */}
          <ProfileSidebar loaded={loaded} />
          {/*//+ posts */}
          <ProfileFeed />
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
            src={currentProfile.banner}
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
                src={currentProfile.avatar}
                alt="avatar"
                onLoad={handleLoad}
                style={!loaded ? { display: 'none' } : null}
              />
              <img
                className={Styles.avatarBlur}
                src={currentProfile.avatar}
                alt="blur"
                style={!loaded ? { display: 'none' } : null}
              />
            </div>
            {avatarModal && (
              <ProfileAvatarModal
                getAvatarModal={getAvatarModal}
                src={currentProfile.avatar}
              />
            )}
            <div className={Styles.topRight}>
              <div className={Styles.topIconRow}>
                {/*//+ following button */}
                <StyledFollowButton
                  as={FollowButton}
                  currentProfile={currentProfile.id}
                />
                {actionButton}
              </div>
              {renderModal && (
                <UploadModal refetch={`findProfileFeed`} getModal={getModal} />
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
          <ProfileFeed match={match} />
        </div>
      </div>
    </>
  );
};

const BaseButton = styled.button`
  border: none;
  box-shadow: 0px 0px 20px 1px rgba(0, 0, 0, 0.103);
  background-color: white;
  color: black;
  height: 44px;
  transition: box-shadow 0.25s, transform 0.25s;
  cursor: pointer;
  box-sizing: border-box;
  font-weight: bold;
  &:hover {
    box-shadow: 0px 3px 20px 1px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }
`;

const StyledFollowButton = styled(BaseButton)`
  border-radius: 20px;
  font-size: 17px;
  padding: 0 32px;
`;

const ActionButton = styled(BaseButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  font-size: 19px;
  border-radius: 100%;
`;

export default Profile;
