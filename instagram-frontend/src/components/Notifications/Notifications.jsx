import React, { useState, useEffect } from 'react';

import NotificationsItem from './NotificationsItem';
import LoadingIcon from '../reusable/LoadingIcon';

import { useAuth } from '../../contexts/AuthContext';
import { useMutation } from '@apollo/client';
import { READ_NOTIFICATIONS } from '../../graphql/mutations/notificationMutations';

import Styles from '../../styles/notifications/notifications.module.css';

const Notifications = ({
  handleNoti,
  setCurrentNotis,
  notiArray,
  setNotiArray,
}) => {
  const { currentUser } = useAuth();
  const [readNotifications, { data, loading, error }] = useMutation(
    READ_NOTIFICATIONS,
    {
      onError: (err) => console.log(err),
      refetchQueries: [`getCurrentUser`],
    }
  );

  useEffect(() => {
    if (currentUser) {
      readNotifications();
    }
  }, []);

  useEffect(() => {
    if (data) {
      setNotiArray(data.readNotifications);
    }
  }, [data]);

  useEffect(() => {
    if (loading) return;
    setCurrentNotis(0);
  }, [loading]);

  let notiFragment;

  if (!loading) {
    notiFragment =
      notiArray && notiArray.length > 0 ? (
        notiArray.map((item) => <NotificationsItem key={item.id} item={item} />)
      ) : (
        <p className={Styles.none}>No Notifications</p>
      );
  }

  return (
    <div onClick={handleNoti} className={Styles.container}>
      <div className={Styles.inner}>
        <LoadingIcon loading={loading} />
        {notiFragment}
      </div>
    </div>
  );
};

export default Notifications;
