import React, { useEffect, useState } from 'react';

import PostComment from './PostComment';
import LoadingIcon from '../reusable/LoadingIcon';

import useCursor from '../../hooks/useCursor';

import { useLazyQuery } from '@apollo/client';
import { FIND_POST_COMMENTS } from '../../graphql/queries/postQueries';

import Styles from '../../styles/post/post__comment-section.module.css';
import Loading from '../../styles/post/post__loading.module.css';

const PostCommentSection = ({
  loaded,
  currentPostId,
  comments,
  setComments,
  ownPost,
}) => {
  const [end, setEnd] = useState(false);
  const [findComments, { loading, data, fetchMore }] = useLazyQuery(
    FIND_POST_COMMENTS,
    {
      onError: (error) => console.log(error),
    }
  );
  const [isFetching, setIsFetching, cursorRef] = useCursor(end, loading);

  useEffect(() => {
    if (currentPostId) {
      findComments({
        variables: {
          id: currentPostId,
          skip: 0,
          limit: 10,
        },
      });
    }
  }, [currentPostId]);

  useEffect(() => {
    if (!data) return;
    if (data.findPostComments.hasMore === false) {
      setEnd(true);
    }
    setComments(data.findPostComments.comments);
    setIsFetching(false);
  }, [data]);

  useEffect(() => {
    if (isFetching) {
      fetchMore({
        variables: {
          id: currentPostId,
          skip: comments.length,
          limit: 10,
        },
      });
    }
  }, [isFetching]);

  return (
    <div className={Styles.commentsContainer}>
      <div className={Styles.comments}>
        {!loaded ? (
          <>
            <div className={Styles.commentContainer}>
              <div className={Loading.commentProfile} />
              <div className={Loading.comment} />
            </div>
            <div className={Styles.commentContainer}>
              <div className={Loading.commentProfile} />
              <div className={Loading.comment} />
            </div>
            <div className={Styles.commentContainer}>
              <div className={Loading.commentProfile} />
              <div className={Loading.comment} />
            </div>
          </>
        ) : (
          <>
            {comments.map((item, index) => {
              return (
                <PostComment
                  key={item.date}
                  time={item.date}
                  id={item.id}
                  comment={item.comment}
                  user={item.user}
                  ownPost={ownPost}
                  cursorRef={cursorRef}
                  index={index}
                  commentsLength={comments.length}
                />
              );
            })}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <LoadingIcon
                size={12}
                isFetching={isFetching}
                loading={loading}
                end={end}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PostCommentSection;
