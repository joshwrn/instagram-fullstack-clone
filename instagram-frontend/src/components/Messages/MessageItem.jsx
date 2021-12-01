import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import ImageLoader from '../reusable/ImageLoader';
import { useAuth } from '../../contexts/AuthContext';

import styled from 'styled-components';

const MessageItem = ({
  recipient,
  sender,
  message,
  thread,
  seen,
  index,
  cursorRef,
}) => {
  const [sent, setSent] = useState(false);
  const [group, setGroup] = useState(true);
  const { currentUser } = useAuth();

  const getStatus = () => {
    if (!currentUser || !sender) return;
    if (sender.id === currentUser.id) {
      setSent(true);
    } else {
      setSent(false);
    }
  };

  useEffect(() => {
    if (!currentUser || !sender) return;
    getStatus();
  }, [currentUser, sender]);

  useEffect(() => {
    if (!recipient || !sender || !thread) return;
    if (
      recipient.id === thread[index + 1]?.recipient.id ||
      sender.id === thread[index + 1]?.sender.id
    ) {
      setGroup(true);
    } else if (
      recipient.id !== thread[index + 1]?.recipient.id ||
      sender.id !== thread[index + 1]?.sender.id
    ) {
      setGroup(false);
    }
  }, [recipient, sender, thread]);

  return (
    <ItemDiv ref={cursorRef} group={group} sent={sent}>
      <Bubble sent={sent}>
        <p>{message}</p>
      </Bubble>
      <SideContainer>
        {!group && currentUser && (
          <Link to={`/profile/${sent ? currentUser.id : sender.id}`}>
            <ImageLoader
              height="38px"
              width="38px"
              borderRadius="100%"
              src={`data:${
                sent
                  ? currentUser.avatar.contentType
                  : sender.avatar.contentType
              };base64,${
                sent ? currentUser.avatar.image : sender.avatar.image
              }`}
            />
          </Link>
        )}
      </SideContainer>
    </ItemDiv>
  );
};

const ItemDiv = styled.div`
  display: flex;
  width: 100%;
  height: fit-content;
  align-items: center;
  flex-direction: ${(props) => (props.sent ? 'row' : 'row-reverse')};
  overflow: hidden;
  flex: 0 0 auto;
  box-sizing: border-box;
  position: relative;
  z-index: 0;
  border-style: solid;
  border-color: ${(props) => props.theme.background.primary};
  border-width: ${(props) => (props.group ? '0px 10px' : '20px 10px 0 10px')};
  &:before {
    content: '';
    flex: 1;
    background: var(--primary-background-color);
    pointer-events: none;
    z-index: 10;
    position: relative;
    width: 100%;
    height: 100%;
  }
  @media only screen and (max-width: 850px) {
    border-width: 2px 2px;
  }
`;

const Bubble = styled.div`
  background-color: ${({ theme, sent }) =>
    sent ? 'none' : theme.message.bubble};
  border-radius: 32px;
  padding: 16px 18px;
  max-width: 60%;
  box-sizing: border-box;
  color: ${({ theme, sent }) => (sent ? 'white' : theme.font.primary)};
  z-index: 0;
  position: relative;
  font-size: 15px;
  word-break: break-word;
  &:before {
    content: '';
    position: absolute;
    left: -15px;
    top: -15px;
    bottom: -15px;
    right: -15px;
    border: 18px solid ${(props) => props.theme.background.primary};
    border-radius: 40px;
    pointer-events: none;
  }
  @media only screen and (max-width: 850px) {
    max-width: ${(props) => (props.sent ? '75%' : '80%')};
  }
`;

const SideContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 50px;
  height: 100%;
  background-color: ${(props) => props.theme.background.primary};
  overflow: hidden;
  a {
    display: flex;
    align-items: center;
    height: 49px;
  }
  @media only screen and (max-width: 850px) {
    width: 5px;
    a {
      display: none;
    }
  }
`;

export default MessageItem;
