import React, { useEffect, useState, useRef } from 'react';

import Card from './HomeCard';

import useIntersect from '../../hooks/useIntersect';

import { useAuth } from '../../contexts/AuthContext';
import { useQuery } from '@apollo/client';
import { FIND_FEED } from '../../graphql/queries/postQueries';

import Styles from '../../styles/home/home__feed.module.css';

const HomeFeed = ({ newPost }) => {
  const { currentUser } = useAuth();
  const [stored, setStored] = useState([]);
  const [feed, setFeed] = useState([]);
  const [lastUser, setLastUser] = useState();

  const [noPosts, setNoPosts] = useState(false);
  const noPostsRef = useRef(false);
  const dummyRef = useRef();
  const [isFetching, setIsFetching] = useIntersect(dummyRef, noPostsRef);

  const { data, loading, error } = useQuery(FIND_FEED);

  //# after feed updates set load to false
  useEffect(() => {
    setIsFetching(false);
    console.log('data', data);
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
