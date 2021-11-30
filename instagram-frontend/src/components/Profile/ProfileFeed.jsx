import React, { useState, useEffect, useRef } from 'react';

import ProfileCard from './ProfileCard';
import LoadingIcon from '../reusable/LoadingIcon';

import useCursor from '../../hooks/useCursor';

import { useQuery } from '@apollo/client';
import { FIND_PROFILE_FEED } from '../../graphql/queries/postQueries';

import Styles from '../../styles/profile/profile__feed.module.css';

const ProfileFeed = ({ match, noPosts }) => {
  const { data, loading, error, fetchMore } = useQuery(FIND_PROFILE_FEED, {
    variables: { id: match && match.params.uid, skip: 0, limit: 9 },
    onError: (err) => console.log(err),
  });
  const [feed, setFeed] = useState([]);

  const [endFeed, setEndFeed] = useState(false);

  const [isFetching, setIsFetching, cursorRef] = useCursor(endFeed, loading);

  useEffect(() => {
    if (data) {
      setFeed(data.findProfileFeed.posts);
      setIsFetching(false);
      if (data.findProfileFeed.hasMore === false) {
        setEndFeed(true);
        setIsFetching(false);
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
              <button className={Styles.notFoundButton}>No Posts</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileFeed;
