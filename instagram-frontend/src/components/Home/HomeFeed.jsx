import React, { useEffect, useState } from 'react';

import Card from './HomeCard';
import LoadingIcon from '../reusable/LoadingIcon';

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
      limit: 5,
    },
  });

  const [isFetching, setIsFetching, cursorRef] = useCursor(noPosts, loading);

  //# after feed updates set load to false
  useEffect(() => {
    if (!data) return;
    if (data.findFeed.hasMore === false) {
      setNoPosts(true);
    }
    setFeed(data.findFeed.posts);
    setIsFetching(false);
  }, [data]);

  useEffect(() => {
    if (noPosts) return setIsFetching(false);
    if (feed.length === 0 || isFetching === false) return;
    fetchMore({
      variables: {
        cursor: feed.length > 0 ? feed[feed.length - 1].date : null,
        limit: 5,
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
            cursorRef={index === feed.length - 1 ? cursorRef : null}
          />
        );
      })}
      <div className={`${Styles.loaderContainer}`}>
        {
          <LoadingIcon
            isFetching={isFetching}
            loading={loading}
            end={noPosts}
          />
        }
        {noPosts && <div className={Styles.noPosts}>No More Posts</div>}
      </div>
    </div>
  );
};

export default HomeFeed;
