import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import HomeCardFooter from './HomeCardFooter';
import HomeCardImage from './HomeCardImage';
import HomeCardOverlay from './HomeCardOverlay';
import HoverCard from '../../reusable/HoverCard';

import styled, { keyframes } from 'styled-components';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

const Card = ({ post, cursorRef }) => {
  const [modal, setModal] = useState(false);
  const [hover, setHover] = useState(false);
  const [type, setType] = useState();

  const getModal = (modalType) => {
    modal ? setModal(false) : setModal(true);
    setType(modalType);
  };

  return (
    <>
      {post && (
        <Outer>
          <Container>
            {modal && (
              <HomeCardOverlay
                getModal={getModal}
                userID={post.user.id}
                type={type}
                post={post}
              />
            )}
            {/*//+ header */}
            <Header>
              <div
                onMouseLeave={() => setHover(false)}
                onMouseEnter={() => setHover(true)}
                className="left"
              >
                <Link to={`/profile/${post.user.id}`}>
                  <Avatar src={post.user.avatar} alt="" />
                </Link>
                <UserInfo>
                  <HoverCard
                    userId={post.user.id}
                    show={hover}
                    setShow={setHover}
                  />
                  <Link to={`/profile/${post.user.id}`}>
                    <DisplayName>{post.user.displayName}</DisplayName>
                    <Username>@{post.user.username}</Username>
                  </Link>
                </UserInfo>
              </div>
              {/*//+ more icon */}
              <div className="right">
                {!modal && (
                  <MoreHorizIcon
                    onClick={() => {
                      getModal('follow');
                    }}
                    className="icon"
                  />
                )}
              </div>
            </Header>
            {/*//+ image */}
            <HomeCardImage
              postID={post.id}
              userID={post.user.id}
              src={post.image}
            />
            {/*//+ footer */}
            <HomeCardFooter
              getModal={getModal}
              post={post}
              cursorRef={cursorRef}
            />
          </Container>
          <ImageBlur src={post.image} alt="" />
        </Outer>
      )}
    </>
  );
};

const Outer = styled.div`
  display: flex;
  width: 560px;
  height: 750px;
  margin: 0 0 64px 0;
  justify-content: center;
  border: ${({ theme }) => theme.border.primary};
  position: relative;
  border-radius: 16px;
  @media only screen and (max-width: 850px) {
    width: 340px;
    height: 590px;
  }
`;

const Container = styled.div`
  position: absolute;
  width: inherit;
  height: inherit;
  border-radius: 16px;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 2;
  width: 100%;
  box-sizing: border-box;
  height: 56px;
  background-color: ${({ theme }) => theme.background.primary};
  padding: 1.5em;
  .left {
    display: flex;
  }
  .right {
    display: flex;
    height: 100%;
    align-items: center;
  }
  .icon {
    cursor: pointer;
  }
`;

const Avatar = styled.img`
  border-radius: 100%;
  height: 36px;
  width: 36px;
  object-fit: cover;
  display: block;
  object-position: center;
  cursor: pointer;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 16px;
`;

const DisplayName = styled.p`
  font-weight: bold;
  font-size: 14.4px;
  cursor: pointer;
`;

const Username = styled.p`
  color: ${({ theme }) => theme.font.secondary};
  font-size: 13.6px;
  cursor: pointer;
`;

const fade = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 0.3;
  }
`;

const ImageBlur = styled.img`
  position: absolute;
  filter: blur(32px);
  opacity: 0;
  width: inherit;
  height: inherit;
  object-fit: cover;
  display: block;
  object-position: center;
  z-index: -2;
  animation: ${fade} 1.5s forwards;
  @media only screen and (max-width: 850px) {
    -webkit-backface-visibility: hidden;
    -webkit-transform: translateZ(0) scale(1, 1);
  }
`;

export default Card;
