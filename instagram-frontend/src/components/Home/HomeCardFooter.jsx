import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import HomeCardLike from './HomeCardLike';
import HomeCardComments from './HomeCardComments';

import styled from 'styled-components';
import {
  IoShareOutline,
  IoChatbubbleOutline,
  IoShareSocialOutline,
} from 'react-icons/io5';

const HomeCardFooter = ({ post, cursorRef, getModal }) => {
  const [likeState, setLikeState] = useState(post?.likes.length);
  return (
    <>
      {post && (
        <Footer ref={cursorRef}>
          <SocialBar>
            <div>
              {/*//+ likes button */}
              <HomeCardLike
                setLikeState={setLikeState}
                post={post}
                userID={post.user.id}
              />
              <Link to={`/Post/${post.user.id}/${post.id}`}>
                <IoChatbubbleOutline className="icon" />
              </Link>
              <Link to={`/Post/${post.user.id}/${post.id}`}>
                <IoShareOutline className="icon" />
              </Link>
            </div>
            <IoShareSocialOutline
              className="icon"
              onClick={() => {
                getModal('share');
              }}
            />
          </SocialBar>
          <Link to={`/Post/${post.user.id}/${post.id}`}>
            <Likes>{likeState} likes</Likes>
          </Link>
          {/*//+ comment section */}
          <HomeCardComments userID={post.user.id} post={post} />
        </Footer>
      )}
    </>
  );
};

const Footer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  padding: 20px 20px;
  background-color: ${({ theme }) => theme.background.primary};
  z-index: 3;
  bottom: 0;
  box-sizing: border-box;
`;

const SocialBar = styled.div`
  font-size: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .icon {
    cursor: pointer;
  }
  div {
    .icon {
      margin: 0 7px 0 0;
    }
  }
`;

const Likes = styled.p`
  cursor: pointer;
  margin: 8px 0;
  font-weight: bold;
  font-size: 13.6px;
`;

export default HomeCardFooter;
