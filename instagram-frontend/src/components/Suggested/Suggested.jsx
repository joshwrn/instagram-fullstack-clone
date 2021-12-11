import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import ImageLoader from '../reusable/ImageLoader';
import FollowButton from '../reusable/FollowButton';

import { useQuery } from '@apollo/client';
import { SUGGESTED_USERS } from '../../graphql/queries/userQueries';

import styled from 'styled-components';

const User = ({ username, displayName, avatar, id }) => {
  return (
    <UserContainer>
      <Link to={`/profile/${id}`}>
        <UserStart>
          <ImageLoader
            width="42px"
            height="42px"
            borderRadius="100%"
            src={avatar}
          />
          <NameContainer>
            <DisplayName>{displayName}</DisplayName>
            <Username>@{username}</Username>
          </NameContainer>
        </UserStart>
      </Link>
      <Button currentProfile={id} />
    </UserContainer>
  );
};

const Suggested = () => {
  const { loading, error, data } = useQuery(SUGGESTED_USERS);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!data) return;
    setUsers(data.suggestedUsers);
  }, [data]);

  return (
    <Container>
      <Header>Suggestions For You</Header>
      {users.map((user) => (
        <User
          key={user.id}
          id={user.id}
          avatar={user.avatar}
          displayName={user.displayName}
          username={user.username}
        />
      ))}
      <InfoContainer>
        <Info>
          About - Help - Press - API - Jobs - Terms - Locations - Hashtags -
          Language
        </Info>
        <Info>© 2021 NOT-INSTAGRAM FROM JOSH</Info>
      </InfoContainer>
    </Container>
  );
};

const Container = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  width: 230px;
  justify-content: center;
  gap: 14px;
`;

const Header = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: ${({ theme }) => theme.font.subtle};
`;

const UserContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

const UserStart = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: center;
`;

const NameContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Username = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.font.secondary};
`;

const DisplayName = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.font.primary};
  font-weight: bold;
`;

const Button = styled(FollowButton)`
  width: 65px;
  height: 27px;
  font-size: 11px;
  background: transparent;
  border: ${({ theme }) => theme.border.subtle};
  color: ${({ theme }) => theme.font.primary};
  border-radius: 16px;
  transition: background-color 0.25s ease-in-out;
  &:hover {
    background-color: ${({ theme }) => theme.font.primary};
    cursor: pointer;
    color: ${({ theme }) => theme.background.primary};
  }
`;

const InfoContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Info = styled.p`
  font-size: 10px;
  color: #727272;
`;

export default Suggested;
