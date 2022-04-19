import React from 'react';
import { useHistory } from 'react-router-dom';

import FollowButton from './FollowButton';
import ImageLoader from './ImageLoader';

import styled from 'styled-components';

const ProfileFollowerListItem = ({
  item,
  Styles,
  handleFollowers,
  cursorRef,
  index,
  listLength,
}) => {
  let history = useHistory();

  const handleLink = (e) => {
    e.preventDefault();
    handleFollowers(e);
    history.push(`/profile/${item?.id}`);
  };

  return (
    <div
      ref={index === listLength - 1 ? cursorRef : null}
      className={Styles.listItem}
    >
      <div onClick={handleLink} className={Styles.start}>
        <div className={Styles.avatarContainer}>
          <ImageLoader src={item?.avatar} borderRadius="100%" />
        </div>
        <div className={Styles.names}>
          <p className={Styles.displayName}>{item?.displayName}</p>
          <p className={Styles.username}>@{item?.username}</p>
        </div>
      </div>

      <StyledFollowButton
        currentProfile={item.id}
        handleFollowers={handleFollowers}
      />
    </div>
  );
};

const StyledFollowButton = styled(FollowButton)`
  background-color: transparent;
  color: ${({ theme }) => theme.font.secondary};
  height: 43px;
  font-size: 16px;
  width: 200px;
  border-radius: 19px;
  cursor: pointer;
  box-sizing: border-box;
  font-weight: bold;
  transition: box-shadow 0.25s, transform 0.25s;
  border: ${({ theme }) => theme.border.secondary};
  &:hover {
    color: ${({ theme }) => theme.background.primary};
    background-color: ${({ theme }) => theme.font.primary};
    box-shadow: 0px 5px 20px 1px rgba(0, 0, 0, 0.25);
    transform: translateY(-2px);
  }
`;

export default ProfileFollowerListItem;
