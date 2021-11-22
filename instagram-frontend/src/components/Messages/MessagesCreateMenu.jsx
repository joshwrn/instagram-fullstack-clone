import React, { useState, useEffect, useRef } from 'react';

import MessagesCreateMenuItem from './MessagesCreateMenuItem';

import useIntersect from '../../hooks/useIntersect';

import { useAuth } from '../../contexts/AuthContext';
import { useLazyQuery } from '@apollo/client';
import { FIND_FOLLOWERS } from '../../graphql/queries/userQueries';

import { IoCloseOutline } from 'react-icons/io5';
import Styles from '../../styles/messages/messages__create-menu.module.css';

const MessagesCreateMenu = ({
  handleCreate,
  setMessageThreads,
  messageThreads,
  setCurrentMessage,
  setCurrentIndex,
  getCurrentMessage,
}) => {
  const [list, setList] = useState([]);
  const ref = useRef();
  const [isFetching, setIsFetching] = useIntersect(ref);
  const [getFollow, { loading, error, data }] = useLazyQuery(FIND_FOLLOWERS);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;
    getFollow({
      variables: {
        type: 'following',
        id: currentUser.id,
      },
    });
  }, [currentUser]);

  useEffect(() => {
    if (!data) return;
    console.log('data', data);
    setList(data.findFollowers);
  }, [data]);

  useEffect(() => {
    setIsFetching(false);
  }, [list]);

  return (
    <div className={Styles.modal}>
      <div className={Styles.container}>
        <div className={Styles.header}>
          <h3>New Message</h3>
          <IoCloseOutline onClick={handleCreate} className={Styles.close} />
        </div>

        {/*//+ list of following is here */}
        <div className={Styles.listContainer}>
          {list.map((item) => {
            return (
              <MessagesCreateMenuItem
                messageThreads={messageThreads}
                setMessageThreads={setMessageThreads}
                Styles={Styles}
                contact={item}
                setCurrentMessage={setCurrentMessage}
                handleCreate={handleCreate}
                setCurrentIndex={setCurrentIndex}
                getCurrentMessage={getCurrentMessage}
                key={item.id}
              />
            );
          })}
          <div ref={ref} />
        </div>
      </div>
    </div>
  );
};

export default MessagesCreateMenu;
