import React from 'react';
import { useHistory } from 'react-router';

import { useAuth } from '../../contexts/AuthContext';

import Styles from '../../styles/home/home__card__overlay.module.css';
import { IoCloseOutline } from 'react-icons/io5';

const HomeCardOverlay = ({ getModal, type, userID, post }) => {
  const { currentUser } = useAuth();
  let history = useHistory();
  //+ unfollow
  const handleUnfollow = async () => {
    getModal();
  };

  const copyToClipboard = (content) => {
    const el = document.createElement('textarea');
    el.value = content;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  const handleShare = () => {
    copyToClipboard(`${window.location.href}post/${userID}/${post.id}`);
    getModal();
  };

  const openLink = (linkType) => {
    history.push(`/${linkType}`);
  };

  let button;

  if (type === 'share') {
    button = (
      <div className={Styles.share}>
        <input
          className={Styles.input}
          value={`${window.location.href}post/${userID}/${post.id}`}
          readOnly
        />
        <button onClick={handleShare} className={Styles.button}>
          Copy Link
        </button>
      </div>
    );
  }

  if (type === 'follow') {
    if (!currentUser) {
      button = (
        <button
          onClick={() => {
            openLink('sign-up');
          }}
          className={Styles.button}
        >
          Login
        </button>
      );
    }

    if (currentUser) {
      if (currentUser.id === userID) {
        button = (
          <button
            onClick={() => {
              openLink('settings');
            }}
            className={Styles.button}
          >
            Edit Profile
          </button>
        );
      }
      if (currentUser.id !== userID) {
        button = (
          <button onClick={handleUnfollow} className={Styles.button}>
            Unfollow
          </button>
        );
      }
    }
  }

  return (
    <div className={Styles.container}>
      <div className={Styles.header}>
        <IoCloseOutline onClick={getModal} className={Styles.close} />
      </div>
      <div className={Styles.main}>{button}</div>
    </div>
  );
};

export default HomeCardOverlay;
