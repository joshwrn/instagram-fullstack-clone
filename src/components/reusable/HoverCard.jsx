import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import LoadingIcon from './LoadingIcon';
import ImageLoader from './ImageLoader';
import FollowButton from './FollowButton';

import { useAuth } from '../../contexts/AuthContext';

import { useLazyQuery } from '@apollo/client';
import { FIND_USER_CARD } from '../../graphql/queries/userQueries';

import styled from 'styled-components';

const Stat = ({ label, number }) => {
  return (
    <StatBox>
      <StatNumber>{number}</StatNumber>
      <StatLabel>{label}</StatLabel>
    </StatBox>
  );
};

const HoverCard = ({ show, setShow, userId }) => {
  const [user, setUser] = useState(null);
  const { currentUser } = useAuth();
  const [getCard, { loading, data }] = useLazyQuery(FIND_USER_CARD, {
    onError: (err) => console.log(err),
  });

  useEffect(() => {
    if (!data) return;
    setUser(data.findUserCard);
  }, [data]);

  useEffect(() => {
    if (show) {
      getCard({ variables: { id: userId } });
    }
  }, [show]);

  return (
    <>
      {show && (
        <Container onMouseEnter={() => setShow(true)}>
          {user ? (
            <>
              <Header>
                <Link to={`/profile/${user.id}`}>
                  <ImageLoader
                    src={user.avatar}
                    width="65px"
                    height="65px"
                    borderRadius="100%"
                    zIndex="20"
                  />
                </Link>
                <Link to={`/profile/${user.id}`}>
                  <InfoContainer>
                    <DisplayName>{user.displayName}</DisplayName>
                    <Username>@{user.username}</Username>
                  </InfoContainer>
                </Link>
              </Header>
              <StatsContainer>
                <Stat label="Followers" number={user.followerCount} />
                <Stat label="Following" number={user.followingCount} />
                <Stat label="Posts" number={user.postCount} />
              </StatsContainer>
              <PostsContainer>
                {user.recentPosts.map((post) => {
                  return (
                    <Link to={`/post/${userId}/${post.id}`} key={post.id}>
                      <ImageLoader height="142px" src={post.image} />
                    </Link>
                  );
                })}
              </PostsContainer>
              <Footer>
                {currentUser && currentUser.id === userId ? null : (
                  <Link to={`/messages/${userId}`}>
                    <Button>Message</Button>
                  </Link>
                )}
                <Button currentProfile={userId} as={FollowButton}>
                  Follow
                </Button>
              </Footer>
            </>
          ) : (
            <LoadingContainer>
              <LoadingIcon loading={loading} />
            </LoadingContainer>
          )}
        </Container>
      )}
    </>
  );
};

const LoadingContainer = styled.div`
  height: 394px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  position: absolute;
  width: 426px;
  height: fit-content;
  transform: translateY(220px) translateX(-50px);
  border: ${({ theme }) => theme.border.secondary};
  background-color: ${({ theme }) => theme.background.primary};
  border-radius: 16px;
  box-shadow: 0px 0px 20px 1px rgba(0, 0, 0, 0.103);
  cursor: initial;
  z-index: 10;

  &:before {
    background-color: transparent;
    content: ' ';
    transform: translateY(-5px);
    height: 12px;
    width: 426px;
    position: absolute;
  }

  &:after {
    top: -16px;
    left: 13%;
    border: solid transparent;
    content: ' ';
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-bottom-color: ${({ theme }) => theme.background.primary};
    border-width: 8px;
  }
`;

const Header = styled.div`
  display: flex;
  height: 100px;
  gap: 25px;
  box-sizing: border-box;
  align-items: center;
  padding: 0 16px;
  width: 100%;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
`;

const DisplayName = styled.p`
  font-size: 20px;
  font-weight: bold;
`;

const Username = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.font.secondary};
`;

const StatsContainer = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  grid-template-columns: repeat(3, 1fr);
  border-top: ${({ theme }) => theme.border.secondary};
  border-bottom: ${({ theme }) => theme.border.secondary};
`;

// stats
const StatNumber = styled.p`
  font-size: 15px;
`;

const StatLabel = styled.p`
  font-size: 13px;
  transition: color 0.2s;
  color: ${({ theme }) => theme.font.secondary};
`;

const StatBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 60px;
  cursor: default;

  &:hover ${StatLabel} {
    color: ${({ theme }) => theme.font.primary};
  }
`;

const PostsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`;

const Footer = styled.div`
  display: flex;
  height: 90px;
  justify-content: center;
  align-items: center;
  gap: 25px;
`;

const Button = styled.button`
  width: 175px;
  height: 40px;
  background: transparent;
  border: ${({ theme }) => theme.border.primary};
  color: ${({ theme }) => theme.font.primary};
  border-radius: 16px;
  transition: background-color 0.25s ease-in-out;
  box-shadow: 0px 0px 20px 1px rgba(0, 0, 0, 0.103);
  &:hover {
    background-color: ${({ theme }) => theme.font.primary};
    cursor: pointer;
    color: ${({ theme }) => theme.background.primary};
  }
`;

export default HoverCard;
