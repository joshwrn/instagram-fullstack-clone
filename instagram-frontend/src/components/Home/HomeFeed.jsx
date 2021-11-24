import React, { useEffect, useState, useRef } from 'react';

import Card from './HomeCard';

import useIntersect from '../../hooks/useIntersect';

import { useAuth } from '../../contexts/AuthContext';
import { useLazyQuery } from '@apollo/client';
import { FIND_FEED } from '../../graphql/queries/postQueries';

import Styles from '../../styles/home/home__feed.module.css';

const HomeFeed = ({ newPost }) => {
  const { currentUser } = useAuth();
  const [feed, setFeed] = useState([]);

  const [noPosts, setNoPosts] = useState(false);
  const noPostsRef = useRef(false);
  const dummyRef = useRef();
  const [isFetching, setIsFetching] = useIntersect(dummyRef, noPostsRef);

  const [getFeed, { data, loading, error }] = useLazyQuery(FIND_FEED);

  useEffect(() => {
    console.log('currentUser feed', currentUser);
    if (!currentUser) return;
    getFeed();
  }, [currentUser]);

  //# after feed updates set load to false
  useEffect(() => {
    setIsFetching(false);
    console.log('set feed', data);
    if (!data) return;
    setFeed(data.findFeed);
  }, [data]);

  return (
    <div className={Styles.container}>
      {feed.map((post) => {
        return <Card key={post.id} post={post} />;
      })}

      <div ref={dummyRef} className={`${Styles.loaderContainer}`}>
        {isFetching && <div className="loader" />}
        {noPosts && <div className={Styles.noPosts}>No More Posts</div>}
      </div>
    </div>
  );
};

export default HomeFeed;
