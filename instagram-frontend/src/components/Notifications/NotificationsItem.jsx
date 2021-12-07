import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import convertTime from '../../functions/convertTime';

import { useAuth } from '../../contexts/AuthContext';

import styled from 'styled-components';
import { IoPersonAdd } from 'react-icons/io5';

const NotificationsItem = ({ item }) => {
  const [addTime, setAddTime] = useState();
  const { currentUser } = useAuth();

  useEffect(() => {
    const currentTime = Date.now();
    const converted = convertTime(item.date, currentTime);
    setAddTime(converted);
  }, []);

  let type;
  if (item) {
    if (item.type === 'like') {
      type = <Type>liked your post.</Type>;
    }

    if (item.type === 'comment') {
      type = (
        <>
          <Type>left a comment:</Type>
          <Comment>
            {item.content.length >= 15
              ? item.content.substring(0, 15) + '...'
              : item.content}
          </Comment>
        </>
      );
    }

    if (item.type === 'follow') {
      type = <Type>followed you.</Type>;
    }
  }

  return (
    <>
      {item && (
        <LinkContainer
          to={`/post/${currentUser.id}/${
            item.type === 'follow' ? item.from.id : item.post?.id
          }`}
        >
          <Container>
            <Start>
              <Avatar src={item.from.avatar} alt="" />
              <DisplayName>{item.from.displayName}</DisplayName>
              {type}
            </Start>
            <End>
              <Time>{addTime}</Time>
              {item.type === 'follow' ? (
                <Icon />
              ) : (
                <Preview src={item.post?.image} alt="" />
              )}
            </End>
          </Container>
        </LinkContainer>
      )}
    </>
  );
};

// container
const LinkContainer = styled(Link)`
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 50px;
  padding: 0 10px;
  box-sizing: border-box;
  cursor: pointer;
  border-radius: 10px;
  font-size: 13.5px;
  &:hover {
    background-color: ${({ theme }) => theme.menu.hover};
  }
  @media only screen and (max-width: 850px) {
    font-size: 11px;
  }
`;

// sections
const Start = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  height: 100%;
`;

const End = styled(Start)`
  justify-content: center;
  width: fit-content;
  gap: 15px;
  height: 25px;
`;

// images
const Image = styled.img`
  width: 25px;
  height: 25px;
  object-fit: cover;
`;

const Avatar = styled(Image)`
  border-radius: 100%;
`;

const Preview = styled(Image)`
  border-radius: 5px;
`;

// text

const DisplayName = styled.p`
  font-weight: bold;
`;

const Type = styled.p`
  color: ${({ theme }) => theme.notification.type};
`;

const Comment = styled.p`
  color: ${({ theme }) => theme.font.secondary};
`;

const Time = styled.span`
  padding-left: 1px;
  color: ${({ theme }) => theme.font.secondary};
`;

// icons

const Icon = styled(IoPersonAdd)`
  font-size: 18px;
`;

export default NotificationsItem;
