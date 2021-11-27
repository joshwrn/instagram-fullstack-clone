import React, { useEffect, useState, useRef, useCallback } from 'react';

import Card from './HomeCard';

import useCursor from '../../hooks/useCursor';

import { useQuery } from '@apollo/client';
import { FIND_FEED } from '../../graphql/queries/postQueries';

import Styles from '../../styles/home/home__feed.module.css';

const HomeFeed = ({ newPost }) => {
  const [feed, setFeed] = useState([]);

  const [noPosts, setNoPosts] = useState(false);

  const { data, loading, error, fetchMore } = useQuery(FIND_FEED, {
    variables: {
      cursor: null,
    },
  });

  const [isFetching, setIsFetching, cursorRef] = useCursor(noPosts, loading);

  //# after feed updates set load to false
  useEffect(() => {
    if (!data) return;
    setFeed(data.findFeed);
    setIsFetching(false);
  }, [data]);

  useEffect(() => {
    if (noPosts) return setIsFetching(false);
    if (feed.length === 0 || isFetching === false) return;
    fetchMore({
      variables: {
        cursor: feed.length > 0 ? feed[feed.length - 1].date : null,
      },
      updateQuery: (previousResult, { fetchMoreResult, queryVariables }) => {
        if (!previousResult || !previousResult.findFeed) return;
        if (fetchMoreResult.findFeed.length === 0) {
          setIsFetching(false);
          setNoPosts(true);
        }
        return {
          ...previousResult,
          // Add the new matches data to the end of the old matches data.
          findFeed: [...previousResult.findFeed, ...fetchMoreResult.findFeed],
        };
      },
    });
  }, [isFetching]);

  return (
    <div className={Styles.container}>
      {feed.map((post, index) => {
        return (
          <Card
            key={post.id}
            post={post}
            dummy={cursorRef}
            feedLength={feed.length}
            index={index}
          />
        );
      })}
      <div className={`${Styles.loaderContainer}`}>
        {isFetching || loading ? <div className="loader" /> : null}
        {noPosts && <div className={Styles.noPosts}>No More Posts</div>}
      </div>
    </div>
  );
};

export default HomeFeed;
