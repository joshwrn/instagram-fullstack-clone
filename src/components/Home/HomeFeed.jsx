import React, { useEffect, useState } from 'react';

import Card from './card/HomeCard';
import LoadingIcon from '../reusable/LoadingIcon';
import NoPosts from '../reusable/NoPosts';

import useCursor from '../../hooks/useCursor';

import { useQuery } from '@apollo/client';
import { FIND_FEED } from '../../graphql/queries/postQueries';

import styled from 'styled-components';

const HomeFeed = () => {
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
    <Container>
      {feed.map((post, index) => {
        return (
          <Card
            key={post.id}
            post={post}
            cursorRef={index === feed.length - 1 ? cursorRef : null}
          />
        );
      })}
      <LoaderContainer>
        {
          <LoadingIcon
            isFetching={isFetching}
            loading={loading}
            end={noPosts}
          />
        }
        <NoPosts noPosts={noPosts} text="No More Posts" />
      </LoaderContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  @media only screen and (max-width: 850px) {
    padding-bottom: 54px;
  }
`;

const LoaderContainer = styled.div`
  margin-bottom: 100px;
`;

export default HomeFeed;
