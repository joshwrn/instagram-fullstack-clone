import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import ImageLoader from '../reusable/ImageLoader';

import resizeImage from '../../functions/resizeImage';

import { useAuth } from '../../contexts/AuthContext';
import { useMutation } from '@apollo/client';
import { EDIT_SETTINGS } from '../../graphql/mutations/userMutations';
import { GET_CURRENT_USER } from '../../graphql/queries/authQueries';

import Styles from '../../styles/settings/settings.module.css';
import { IoImage, IoPencil } from 'react-icons/io5';

const Settings = () => {
  const [userInput, setUserInput] = useState('');
  const [userBio, setUserBio] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { currentUser } = useAuth();
  const [editSettings] = useMutation(EDIT_SETTINGS, {
    onError(err) {
      console.log(err);
    },
    refetchQueries: [{ query: GET_CURRENT_USER }],
  });

  useEffect(() => {
    if (!currentUser) return;
    setUserInput(currentUser.displayName);
    setUserBio(currentUser.bio);
    setAvatarPreview(currentUser.avatar.image);
    setBannerPreview(currentUser.banner.image);
  }, [currentUser]);

  //+ updates on account sign up

  useEffect(() => {}, [currentUser]);

  //! handle photo uploads
  //@ add file to state
  const handlePhotoChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file && file.size < 5000000) {
      if (e.target.name === 'profilePhoto') {
        resizeImage(e, 'none', setAvatarPreview, 1000);
      } else if (e.target.name === 'banner') {
        resizeImage(e, 'none', setBannerPreview, 2000);
      }
    }
  };

  //! handle text input changes
  //@ handle display name change
  const handleChange = (e) => {
    const { value } = e.target;
    const reg = /[^a-zA-Z' ']/gi; //replace all but these characters
    const newVal = value.replace(reg, '');
    setUserInput(newVal);
  };

  //@ handle bio change
  const handleBioChange = (e) => {
    const { value } = e.target;
    setUserBio(value);
  };

  //+ handle save
  const handleSave = async (e) => {
    e.preventDefault();
    setUploading(true);
    let settings = {};
    if (userBio !== currentUser.bio) {
      settings.bio = userBio.trim();
    }
    if (userInput !== currentUser.displayName && userInput.trim() !== '') {
      const lower = userInput.trim().toLowerCase();
      settings.displayName = lower;
    }
    if (avatarPreview !== currentUser.avatar.image) {
      settings.avatar = avatarPreview;
    }
    if (bannerPreview !== currentUser.banner.image) {
      settings.banner = bannerPreview;
    }
    await editSettings({
      variables: { ...settings },
    });
    setUploading(false);
  };

  return (
    <>
      {currentUser && (
        <div className={Styles.settings}>
          <div className={Styles.container}>
            <h3>Settings</h3>
            <div className={Styles.inner}>
              <div>
                <label className={Styles.bannerOverlayContainer}>
                  <input
                    name="banner"
                    type="file"
                    accept="image/jpeg, image/png, image/jpg"
                    className={Styles.fileInput}
                    onChange={handlePhotoChange}
                  />
                  <div className={Styles.bannerContainer}>
                    <ImageLoader
                      src={`data:${'image/jpeg'};base64,${bannerPreview}`}
                      zIndex={'0'}
                    />
                  </div>
                  <div className={Styles.bannerOverlay}>
                    <IoPencil className={Styles.bannerIcon} />
                  </div>
                </label>
                <form>
                  <div className={Styles.containerBar}>
                    <label className={Styles.profileOverlayContainer}>
                      <input
                        onChange={handlePhotoChange}
                        type="file"
                        accept="image/jpeg, image/png, image/jpg"
                        className={Styles.fileInput}
                        name="profilePhoto"
                      />
                      <ImageLoader
                        src={`data:${'image/jpeg'};base64,${avatarPreview}`}
                        position="relative"
                        borderRadius="100%"
                        width="112px"
                        height="112px"
                        shadow="0px 0.5em 1.5em 1px rgba(0, 0, 0, 0.1)"
                      />
                      <div className={Styles.profileOverlay}>
                        <IoImage className={Styles.profileIcon} />
                      </div>
                    </label>
                  </div>
                </form>
              </div>
              <div className={Styles.textInputs}>
                <form className={Styles.textForm}>
                  <div className={Styles.inputContainer}>
                    <p>Display Name:</p>
                    <div className={Styles.input}>
                      <input
                        autoComplete="off"
                        name="displayName"
                        className={Styles.inputBoxDisplay}
                        type="text"
                        placeholder={currentUser && currentUser.displayName}
                        maxLength="25"
                        minLength="3"
                        onChange={handleChange}
                        value={userInput}
                      />
                    </div>
                  </div>
                  <div className={Styles.inputContainer}>
                    <p>Bio:</p>
                    <textarea
                      className={Styles.bioInput}
                      name="bio"
                      maxLength="150"
                      placeholder={currentUser.bio}
                      value={userBio}
                      onChange={handleBioChange}
                    />
                  </div>
                </form>
              </div>
            </div>

            <div className={Styles.profileBtnContainer}>
              {uploading ? (
                <div className="loader"></div>
              ) : (
                <button
                  onClick={handleSave}
                  type="submit"
                  className={Styles.textBtn}
                >
                  Save
                </button>
              )}
              <Link
                className={Styles.profileLink}
                to={`/profile/${currentUser.id}`}
              >
                <button className={Styles.profileBtn}>View Profile</button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;
