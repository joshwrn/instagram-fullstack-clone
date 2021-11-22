import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import ImageLoader from '../reusable/ImageLoader';
import { useAuth } from '../../contexts/AuthContext';

import Styles from '../../styles/messages/message__item.module.css';

const MessageItem = ({ recipient, sender, message, thread, index }) => {
  const [sent, setSent] = useState(false);
  const [group, setGroup] = useState('false');
  const { currentUser } = useAuth();

  const getStatus = () => {
    if (!currentUser || !sender) return;
    if (sender.id === currentUser.id) {
      setSent(true);
    }
  };

  useEffect(() => {
    getStatus();
  }, [currentUser]);

  useEffect(() => {
    if (!recipient || !sender || !thread) return;
    if (recipient.id === thread[index + 1]?.recipient.id) {
      setGroup('true');
    } else if (recipient.id !== thread[index + 1]?.recipient.id) {
      setGroup('avatar');
    } else if (sender.id === thread[index + 1]?.sender.id) {
      setGroup('true');
    } else if (sender.id !== thread[index + 1]?.sender.id) {
      setGroup('avatar');
    }
  }, [recipient, sender, thread]);

  let item;

  if (sent && group === 'true') {
    item = (
      <div className={Styles.itemSent + ' ' + Styles.group}>
        <div className={Styles.bubbleSent}>
          <p>{message}</p>
        </div>
        <div className={Styles.sideContainer} />
      </div>
    );
  }

  if (sent && group === 'avatar') {
    item = (
      <div className={Styles.itemSent + ' ' + Styles.topGroup}>
        <div className={Styles.bubbleSent}>
          <p>{message}</p>
        </div>
        <div className={Styles.sideContainer}>
          <Link to={`/profile/${currentUser.id}`}>
            <ImageLoader
              height="38px"
              width="38px"
              borderRadius="100%"
              src={`data:${currentUser?.avatar.contentType};base64,${currentUser?.avatar.image}`}
            />
          </Link>
        </div>
      </div>
    );
  }

  if (!sent && group === 'true') {
    item = (
      <div className={Styles.item + ' ' + Styles.group}>
        <div className={Styles.bubble}>
          <p>{message}</p>
        </div>
        <div className={Styles.sideContainer} />
      </div>
    );
  }

  if (!sent && group === 'avatar') {
    item = (
      <div className={Styles.item + ' ' + Styles.topGroup}>
        <div className={Styles.bubble}>
          <p>{message}</p>
        </div>
        <div className={Styles.sideContainer}>
          <Link to={`/profile/${sender.id}`}>
            <ImageLoader
              height="38px"
              width="38px"
              borderRadius="100%"
              src={`data:${sender?.avatar.contentType};base64,${sender?.avatar.image}`}
            />
          </Link>
        </div>
      </div>
    );
  }

  return <>{item}</>;
};

export default MessageItem;
