import React from 'react';
import { useHistory } from 'react-router-dom';

import FollowButton from './FollowButton';
import ImageLoader from './ImageLoader';

const ProfileFollowerListItem = ({
  item,
  Styles,
  handleFollowers,
  currentUser,
}) => {
  let history = useHistory();

  const handleLink = (e) => {
    e.preventDefault();
    handleFollowers(e);
    history.push(`/profile/${item?.id}`);
  };

  return (
    <div className={Styles.listItem}>
      <div onClick={handleLink} className={Styles.start}>
        <div className={Styles.avatarContainer}>
          <ImageLoader
            src={`data:${item?.avatar.contentType};base64,${item?.avatar.image}`}
            borderRadius="100%"
          />
        </div>
        <div className={Styles.names}>
          <p className={Styles.displayName}>{item?.displayName}</p>
          <p className={Styles.username}>@{item?.username}</p>
        </div>
      </div>

      <FollowButton
        currentProfile={item}
        match={item?.id}
        currentUser={currentUser}
        Styles={Styles}
        handleFollowers={handleFollowers}
      />
    </div>
  );
};

export default ProfileFollowerListItem;
