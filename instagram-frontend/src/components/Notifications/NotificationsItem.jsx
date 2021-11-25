import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import convertTime from '../../functions/convertTime';

import { useAuth } from '../../contexts/AuthContext';

import Styles from '../../styles/notifications/notifications__item.module.css';
import { IoPersonAdd } from 'react-icons/io5';

const NotificationsItem = ({ item }) => {
  const [addTime, setAddTime] = useState();
  const { currentUser } = useAuth();

  useEffect(() => {
    const currentTime = Date.now();
    const converted = convertTime(item.date, currentTime);
    setAddTime(converted);
  }, []);

  let type;
  if (item) {
    if (item.type === 'like') {
      type = (
        <Link
          className={Styles.link}
          to={`/post/${currentUser.id}/${item.post.id}`}
        >
          <div className={Styles.container}>
            <div className={Styles.start}>
              <div className={Styles.avatarContainer}>
                <img
                  className={Styles.avatar}
                  src={`data:${item.from.avatar.contentType};base64,${item.from.avatar.image}`}
                  alt=""
                />
              </div>
              <div className={Styles.displayName}>{item.from.displayName}</div>
              <div className={Styles.type}>liked your post.</div>
            </div>
            <div className={Styles.end}>
              <span className={Styles.time}>{`${addTime}`}</span>
              <img
                className={Styles.preview}
                src={`data:${item.post.contentType};base64,${item.post.image}`}
                alt=""
              />
            </div>
          </div>
        </Link>
      );
    }
    if (item.type === 'comment') {
      type = (
        <Link
          className={Styles.link}
          to={`/post/${currentUser.id}/${item.post.id}`}
        >
          <div className={Styles.container}>
            <div className={Styles.start}>
              <div className={Styles.avatarContainer}>
                <img
                  className={Styles.avatar}
                  src={`data:${item.from.avatar.contentType};base64,${item.from.avatar.image}`}
                  alt=""
                />
              </div>
              <div className={Styles.displayName}>{item.from.displayName}</div>
              <div className={Styles.type}>left a comment:</div>
              <div className={Styles.comment}>
                {item.content.length >= 15
                  ? item.content.substring(0, 15) + '...'
                  : item.content}
              </div>
            </div>
            <div className={Styles.end}>
              <span className={Styles.time}>{`${addTime}`}</span>
              <img
                className={Styles.preview}
                src={`data:${item.post.contentType};base64,${item.post.image}`}
                alt=""
              />
            </div>
          </div>
        </Link>
      );
    }
  }
  if (item.type === 'follow') {
    type = (
      <Link className={Styles.link} to={`/profile/${item.from.id}`}>
        <div className={Styles.container}>
          <div className={Styles.start}>
            <div className={Styles.avatarContainer}>
              <img
                className={Styles.avatar}
                src={`data:${item.from.avatar.contentType};base64,${item.from.avatar.image}`}
                alt=""
              />
            </div>
            <div className={Styles.displayName}>{item.from.displayName}</div>
            <div className={Styles.type}>followed you.</div>
          </div>
          <div className={Styles.end}>
            <span className={Styles.time}>{`${addTime}`}</span>
            <IoPersonAdd className={Styles.followed} />
          </div>
        </div>
      </Link>
    );
  }

  return <>{item && type}</>;
};

export default NotificationsItem;
