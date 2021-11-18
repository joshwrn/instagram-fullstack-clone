import React, { useEffect, useRef } from 'react';

import PostComment from './PostComment';

import useIntersect from '../../hooks/useIntersect';

import Styles from '../../styles/post/post__comment-section.module.css';
import Loading from '../../styles/post/post__loading.module.css';

const PostCommentSection = ({ loaded, currentPost, comments, setComments }) => {
  const ref = useRef();
  const [isFetching, setIsFetching] = useIntersect(ref);

  const getMore = () => {
    console.log('get more');
    if (!currentPost) return;
    const reverse = currentPost.comments.slice(0).reverse();
    const sliced = reverse.slice(comments.length, comments.length + 10);
    const combine = [...comments, ...sliced];
    setComments(combine);
  };

  useEffect(() => {
    if (!isFetching) return;
    getMore();
  }, [isFetching]);

  useEffect(() => {
    setIsFetching(false);
  }, [comments]);

  return (
    <div className={Styles.commentsContainer}>
      <div className={Styles.comments}>
        {/* <p className="view-all">View All Comments</p> */}
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
            {comments.map((item) => {
              return (
                <PostComment
                  key={item.date}
                  time={item.date}
                  comment={item.comment}
                  user={item.user}
                />
              );
            })}
          </>
        )}
        <div ref={ref}></div>
      </div>
    </div>
  );
};

export default PostCommentSection;
