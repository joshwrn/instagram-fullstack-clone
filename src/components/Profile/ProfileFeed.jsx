import React, { useState, useEffect, useRef } from 'react';

import ProfileCard from './ProfileCard';
import LoadingIcon from '../reusable/LoadingIcon';
import NoPosts from '../reusable/NoPosts';

import useCursor from '../../hooks/useCursor';

import { useLazyQuery } from '@apollo/client';
import { FIND_PROFILE_FEED } from '../../graphql/queries/postQueries';

import Styles from '../../styles/profile/profile__feed.module.css';

const ProfileFeed = ({ match }) => {
  const [getInitialFeed, { data, loading, error, fetchMore }] = useLazyQuery(
    FIND_PROFILE_FEED,
    {
      onError: (err) => console.log(err),
    }
  );
  const [feed, setFeed] = useState([]);
  const [noPosts, setNoPosts] = useState(false);

  const [endFeed, setEndFeed] = useState(false);

  const [isFetching, setIsFetching, cursorRef] = useCursor(endFeed, loading);

  useEffect(() => {
    if (!match) return;
    getInitialFeed({
      variables: { id: match && match.params.uid, skip: 0, limit: 9 },
    });
  }, [match]);

  useEffect(() => {
    if (data) {
      setFeed(data.findProfileFeed.posts);
      setNoPosts(false);
      setIsFetching(false);
      if (data.findProfileFeed.hasMore === false) {
        setEndFeed(true);
        setIsFetching(false);
        if (data.findProfileFeed.posts.length === 0) {
          setNoPosts(true);
        }
      }
    }
  }, [data]);

  useEffect(() => {
    if (noPosts) return setIsFetching(false);
    if (feed.length === 0 || isFetching === false) return;
    console.log('fetch more');
    fetchMore({
      variables: {
        skip: feed.length,
        limit: 9,
      },
    });
  }, [isFetching]);

  //# after feed updates set load to false
  useEffect(() => {
    setIsFetching(false);
  }, [feed]);

  return (
    <>
      {!noPosts ? (
        <div className={Styles.feedContainer}>
          <div className={Styles.feed}>
            {feed.map((item, index) => {
              return (
                <ProfileCard
                  key={item.id}
                  src={item.image}
                  match={match}
                  postId={item.id}
                  likeCount={item.likeCount}
                  commentCount={item.commentCount}
                  contentType={item.contentType}
                  index={index}
                  feedLength={feed.length}
                  cursorRef={cursorRef}
                />
              );
            })}
          </div>
          <div className={`${Styles.loaderContainer}`}>
            <LoadingIcon
              end={endFeed}
              isFetching={isFetching}
              loading={loading}
            />
            {endFeed && feed.length > 3 ? (
              <div className={Styles.endFeed}>No More Posts</div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className={Styles.outer}>
          <div className={Styles.notFound}>
            <div className={Styles.notFoundContainer}>
              <NoPosts text="No Posts" noPosts={noPosts} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileFeed;
