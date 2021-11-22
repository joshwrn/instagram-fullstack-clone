import React, { useState, useEffect } from 'react';

import ImageLoader from '../reusable/ImageLoader';

const MessagesCreateMenuItem = ({
  Styles,
  contact,
  setMessageThreads,
  messageThreads,
  handleCreate,
  getCurrentMessage,
}) => {
  const handleClick = (e) => {
    e.preventDefault();
    const check = messageThreads.some(
      (thread) => thread.otherUser.id === contact.id
    );
    if (!check) {
      setMessageThreads([
        {
          otherUser: {
            id: contact.id,
            displayName: contact.displayName,
            avatar: {
              image: contact.avatar.image,
              contentType: contact.avatar.contentType,
            },
          },
          date: Date.now(),
          messages: [],
          id: Math.random(),
        },
        ...messageThreads,
      ]);
      handleCreate(e);
    } else {
      const index = messageThreads.findIndex(
        (thread) => thread.otherUser.id === contact.id
      );
      getCurrentMessage(index);
      handleCreate(e);
    }
  };

  return (
    <div onClick={handleClick} className={Styles.listItem}>
      <div className={Styles.start}>
        <div className={Styles.avatarContainer}>
          <ImageLoader
            src={`data:${contact?.avatar.contentType};base64,${contact?.avatar.image}`}
            width="65px"
            height="65px"
            borderRadius="100%"
          />
        </div>
        <div className={Styles.names}>
          <p className={Styles.displayName}>{contact?.displayName}</p>
          <p className={Styles.username}>@{contact?.username}</p>
        </div>
      </div>
    </div>
  );
};

export default MessagesCreateMenuItem;
