import React, { useEffect, useState } from 'react';

import ImageLoader from '../reusable/ImageLoader';

import convertTime from '../../functions/convertTime';

import Styles from '../../styles/messages/messagesContact.module.css';

const MessagesContact = ({
  otherUser,
  time,
  last,
  getCurrentMessage,
  index,
  currentIndex,
  handleSidebar,
}) => {
  const [addTime, setAddTime] = useState('');

  const getTime = () => {
    const currentTime = Date.now();
    const converted = convertTime(time, currentTime);
    setAddTime(converted);
  };

  useEffect(() => {
    getTime();
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    getCurrentMessage(index);
    handleSidebar();
  };

  return (
    <div
      onClick={handleClick}
      className={index === currentIndex ? Styles.active : Styles.container}
    >
      <div className={Styles.avatarContainer}>
        <ImageLoader
          src={`data:${otherUser?.avatar.contentType};base64,${otherUser?.avatar.image}`}
          width="65px"
          height="65px"
          borderRadius="100%"
        />
      </div>

      <div className={Styles.contactInfo}>
        <p className={Styles.name}>{otherUser?.displayName}</p>
        <div className={Styles.infoContainer}>
          <p className={Styles.message}>
            {last?.message.length >= 15
              ? last?.message.substring(0, 15) + '...'
              : last?.message}
          </p>
          <p className={Styles.time}>{addTime}</p>
        </div>
      </div>
    </div>
  );
};

export default MessagesContact;
