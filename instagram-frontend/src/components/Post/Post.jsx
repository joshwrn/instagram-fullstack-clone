import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import PostSidebar from './PostSidebar';

import ScrollToTop from '../../functions/ScrollToTop';
import useBuffer from '../../hooks/useBuffer';

import { useAuth } from '../../contexts/AuthContext';
import { FIND_POST_BY_ID } from '../../graphql/queries/postQueries';
import { useQuery } from '@apollo/client';

import Styles from '../../styles/post/post.module.css';
import Loading from '../../styles/post/post__loading.module.css';

const Post = ({ match }) => {
  const [currentPost, setCurrentPost] = useState();
  const [postImage, setPostImage] = useBuffer(currentPost);
  const [postUser, setPostUser] = useState();
  const [ownPost, setOwnPost] = useState(false);
  const [loading, setLoading] = useState([
    { image: 'avatar', loading: true },
    { image: 'post', loading: true },
  ]);
  const [loaded, setLoaded] = useState(false);
  const { currentUser, userProfile } = useAuth();

  //+ determine if this is the user's post
  useEffect(() => {
    if (currentUser && match.params.uid === currentUser.id) {
      setOwnPost(true);
    }
  }, [postUser]);

  //$ graphql query for the current post
  const {
    loading: postLoading,
    error: postError,
    data: postData,
  } = useQuery(FIND_POST_BY_ID, {
    variables: {
      id: match.params.postid,
    },
  });

  useEffect(() => {
    if (postData && !postLoading && !postError) {
      setCurrentPost(postData.findPost);
      setPostUser(postData.findPost.user);
    }
  }, [postData]);

  //+ check if postUser and currentUser are defined then set loading false
  useEffect(() => {
    if (postUser && currentPost) {
      if (loading.every((item) => item.loading === false)) {
        setLoaded(true);
      }
    }
  }, [loading]);

  //+ update the loading state
  const handleLoad = (e) => {
    const { alt } = e.target;
    const imgIndex = loading.findIndex((img) => img.image === alt);
    setLoading((prev) => [...prev], {
      [loading[imgIndex]]: (loading[imgIndex].loading = false),
    });
  };

  let postState;

  if (!currentPost || !postUser) {
    postState = (
      <div className={Styles.post}>
        <ScrollToTop />
        <div className={Styles.container}>
          <div
            className={Loading.image + ' ' + 'gradientLoad'}
            style={loaded ? { display: 'none' } : null}
          />
          <PostSidebar
            match={match}
            loaded={loaded}
            handleLoad={handleLoad}
            postUser={postUser}
            postUserAvatar={postUser}
            ownPost={ownPost}
            currentPost={currentPost}
            currentUser={currentUser}
            userProfile={userProfile}
          />
        </div>
      </div>
    );
  }

  //+ if finished loading
  if (postUser && currentPost) {
    postState = (
      <div className={Styles.post}>
        <ScrollToTop />
        <div className={Styles.container}>
          <div
            className={Loading.image + ' ' + 'gradientLoad'}
            style={loaded ? { display: 'none' } : null}
          />
          <img
            style={!loaded ? { display: 'none' } : null}
            onLoad={handleLoad}
            src={postImage}
            alt="post"
            className={Styles.image}
          />
          <PostSidebar
            match={match}
            loaded={loaded}
            handleLoad={handleLoad}
            postUser={postUser}
            postUserAvatar={postUser.avatar}
            ownPost={ownPost}
            currentPost={currentPost}
            currentUser={currentUser}
            userProfile={userProfile}
          />
        </div>
      </div>
    );
  }

  //+ if there was an error
  if (loaded === 'error') {
    postState = (
      <div className={Styles.post}>
        <div className={Styles.notFoundContainer}>
          <h3>Post Not Found</h3>
          <Link to="/">
            <button className={Styles.returnButton}>Return Home</button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{postState}</>;
};

export default Post;
