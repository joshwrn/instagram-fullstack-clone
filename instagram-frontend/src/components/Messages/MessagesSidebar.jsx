import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import ImageLoader from '../reusable/ImageLoader';
import MessagesContact from './MessagesContact';

import { useAuth } from '../../contexts/AuthContext';

import { IoCreateOutline, IoChevronBackOutline } from 'react-icons/io5';

const MessagesSidebar = ({
  Styles,
  messageThreads,
  getCurrentMessage,
  currentIndex,
  scrollToBottom,
  handleCreate,
}) => {
  const [sidebar, setSidebar] = useState(true);

  const { currentUser } = useAuth();

  //! MOBILE Sidebar
  const handleSidebar = () => {
    sidebar ? setSidebar(false) : setSidebar(true);
    scrollToBottom();
  };

  return (
    <div
      className={sidebar ? Styles.sidebar : `${Styles.sidebar} ${Styles.hide}`}
    >
      <div className={Styles.header}>
        <div
          className={
            sidebar
              ? Styles.userAvatarContainer
              : `${Styles.userAvatarContainer} ${Styles.remove}`
          }
        >
          <Link to={`/profile/${currentUser?.id}`}>
            <ImageLoader
              src={currentUser?.avatar}
              width="65px"
              height="65px"
              borderRadius="100%"
              position="absolute"
            />
            <img
              className={Styles.userAvatarBlur}
              src={currentUser?.avatar}
              alt="avatar"
            />
          </Link>
        </div>
        {sidebar ? null : (
          <div className={Styles.backArrowContainer}>
            <IoChevronBackOutline
              onClick={handleSidebar}
              className={Styles.backArrow}
            />
          </div>
        )}
        <p className={Styles.headerTitle}>Messages</p>
        <div onClick={handleCreate} className={Styles.createIconContainer}>
          <IoCreateOutline className={Styles.createIcon} />
        </div>
      </div>
      <div
        className={
          sidebar
            ? Styles.contactsContainer
            : `${Styles.contactsContainer} ${Styles.hide}`
        }
      >
        {/* map over messages */}
        {messageThreads.map((item, index) => {
          return (
            <MessagesContact
              key={item.id}
              time={item.date}
              index={index}
              otherUser={item.otherUser}
              last={item.messages?.length > 0 ? item.messages[0] : null}
              getCurrentMessage={getCurrentMessage}
              currentIndex={currentIndex}
              handleSidebar={handleSidebar}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MessagesSidebar;
