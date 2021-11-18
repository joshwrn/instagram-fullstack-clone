import React, { useState, useEffect, useRef } from 'react';

import ProfileCard from './ProfileCard';

import useIntersect from '../../hooks/useIntersect';

import Styles from '../../styles/profile/profile__feed.module.css';

const ProfileFeed = ({ match, newPost, noPosts, posts }) => {
  const [feed, setFeed] = useState([]);
  const [lastPost, setLastPost] = useState();

  const [endFeed, setEndFeed] = useState(false);
  const endFeedRef = useRef(false);

  const dummyRef = useRef();
  const [isFetching, setIsFetching] = useIntersect(dummyRef, endFeedRef);

  // // get the feed after a new post
  // useEffect(() => {
  //   return getFeed();
  // }, [newPost]);

  useEffect(() => {
    if (!posts) return;
    setFeed(posts);
    setEndFeed(false);
    endFeedRef.current = false;
  }, [match, posts]);

  // every time loads complete check the count to see if all the posts match the feed length

  //# after feed updates set load to false
  useEffect(() => {
    setIsFetching(false);
  }, [feed]);

  return (
    <>
      {!noPosts ? (
        <div className={Styles.feedContainer}>
          <div className={Styles.feed}>
            {feed.map((item) => {
              return (
                <ProfileCard
                  key={item.id}
                  src={item.image}
                  match={match}
                  postId={item.id}
                  likeCount={item.likeCount}
                  commentCount={item.commentCount}
                  contentType={item.contentType}
                />
              );
            })}
          </div>
          <div ref={dummyRef} className={`${Styles.loaderContainer}`}>
            {isFetching && <div className="loader" />}
            {endFeed && feed.length > 6 ? (
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
