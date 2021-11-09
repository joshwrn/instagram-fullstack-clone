import React, { useState, useEffect, useRef } from 'react';
import ProfileCard from './ProfileCard';
import Styles from '../../styles/profile/profile__feed.module.css';
import useIntersect from '../../hooks/useIntersect';

const ProfileFeed = ({ firestore, match, newPost, noPosts, posts }) => {
  const [feed, setFeed] = useState([]);
  const [lastPost, setLastPost] = useState();

  const [endFeed, setEndFeed] = useState(false);
  const endFeedRef = useRef(false);

  const dummyRef = useRef();
  const [isFetching, setIsFetching] = useIntersect(dummyRef, endFeedRef);

  // const getMore = async () => {
  //   let temp = [];
  //   if (!lastPost) return;
  //   const snap = await firestore
  //     .collection('users')
  //     .doc(match.params.uid)
  //     .collection('posts')
  //     .orderBy('date', 'desc')
  //     .startAfter(lastPost)
  //     .limit(8)
  //     .get();
  //   await snap.forEach((doc) => {
  //     doc.complete = false;
  //     temp.push(doc);
  //   });
  //   if (!snap.docs[snap.docs.length - 1]) {
  //     setIsFetching(false);
  //     setEndFeed(true);
  //     endFeedRef.current = true;
  //     return;
  //   }
  //   setLastPost(snap.docs[snap.docs.length - 1]);
  //   return temp;
  // };

  // const getInitial = async () => {
  //   let temp = [];
  //   const snap = await firestore
  //     .collection('users')
  //     .doc(match.params.uid)
  //     .collection('posts')
  //     .orderBy('date', 'desc')
  //     .limit(8)
  //     .get();
  //   await snap.forEach((doc) => {
  //     doc.complete = false;
  //     temp.push(doc);
  //   });
  //   setLastPost(snap.docs[snap.docs.length - 1]);
  //   return temp;
  // };

  const updateFeed = async () => {
    // const temp = await getMore();
    // if (!temp) return;
    // const combine = [...feed, ...temp];
    // setFeed(combine);
  };

  //! get the feed
  // const getFeed = async () => {
  //   //const temp = await getInitial();
  //   const temp = [];
  //   setFeed(temp);
  // };

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

  //# decide from local or firestore
  useEffect(() => {
    if (!isFetching || endFeed) return;
    updateFeed();
  }, [isFetching]);

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