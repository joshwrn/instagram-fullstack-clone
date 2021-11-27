import React, { useState, useEffect, useRef } from 'react';

import FollowerListItem from './FollowerListItem';

import useIntersect from '../../hooks/useIntersect';
import useCursor from '../../hooks/useCursor';

import { useLazyQuery } from '@apollo/client';
import { FIND_FOLLOWERS } from '../../graphql/queries/userQueries';

import { IoCloseOutline } from 'react-icons/io5';
import Styles from '../../styles/profile/profile__followers-modal.module.css';

const FollowersModal = ({
  openFollowers,
  handleFollowers,
  currentProfile,
  currentTab,
  setCurrentTab,
  currentUser,
}) => {
  const [getFollow, { loading, error, data }] = useLazyQuery(FIND_FOLLOWERS);
  const [list, setList] = useState([]);
  const [none, setNone] = useState(false);

  // const ref = useRef();
  // const [isFetching, setIsFetching] = useIntersect(ref);
  const [isFetching, setIsFetching, cursorRef] = useCursor(none, loading);

  const handleSwitch = (e) => {
    e.preventDefault();
    const choice = e.target.getAttribute('data-type');
    setCurrentTab(choice);
  };

  useEffect(() => {
    if (!data) return;
    console.log(data);
    setList(data.findFollowers);
  }, [data]);

  useEffect(() => {
    if (!currentProfile || !openFollowers) return;
    getFollow({
      variables: {
        type: currentTab,
        id: currentProfile.id,
      },
    });
  }, [currentTab, openFollowers]);

  useEffect(() => {
    setIsFetching(false);
  }, [list]);

  let map;

  if (currentTab === 'following') {
    map = list.map((item, index) => {
      return (
        <FollowerListItem
          currentTab={currentTab}
          handleFollowers={handleFollowers}
          item={item}
          Styles={Styles}
          currentUser={currentUser}
          key={item.id}
          cursorRef={cursorRef}
          index={index}
          listLength={list.length}
        />
      );
    });
  }

  if (currentTab === 'followers') {
    map = list.map((item, index) => {
      return (
        <FollowerListItem
          currentTab={currentTab}
          handleFollowers={handleFollowers}
          item={item}
          Styles={Styles}
          currentUser={currentUser}
          key={item.id}
          cursorRef={cursorRef}
          index={index}
          listLength={list.length}
        />
      );
    });
  }

  return (
    <>
      {openFollowers && (
        <div className={Styles.modal}>
          <div className={Styles.container}>
            <div className={Styles.header}>
              <div className={Styles.tabs}>
                <div
                  onClick={handleSwitch}
                  data-type="following"
                  className={
                    currentTab === 'following'
                      ? Styles.activeHeader
                      : Styles.inactiveHeader
                  }
                >
                  <h3 data-type="following">Following</h3>
                </div>
                <div
                  onClick={handleSwitch}
                  data-type="followers"
                  className={
                    currentTab === 'followers'
                      ? Styles.activeHeader
                      : Styles.inactiveHeader
                  }
                >
                  <h3 data-type="followers">Followers</h3>
                </div>
              </div>
              <IoCloseOutline
                onClick={handleFollowers}
                className={Styles.close}
              />
            </div>
            {/*//+ list of followers is here */}
            <div className={Styles.listContainer}>{map}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default FollowersModal;
