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
  const [loaded, setLoaded] = useState(false);
  const { currentUser } = useAuth();

  const getStatus = () => {
    if (!currentUser || !sender) return;
    if (sender.id === currentUser.id) {
      setSent(true);
    } else {
      setSent(false);
    }
    setLoaded(true);
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
    <>
      {loaded && (
        <ItemDiv ref={cursorRef} group={group} sent={sent}>
          <BubbleWrapper>
            <Bubble sent={sent}>
              <p>{message}</p>
            </Bubble>
            {index === 0 && <Status>{seen}</Status>}
          </BubbleWrapper>
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
      )}
    </>
  );
};

const ItemDiv = styled.div`
  display: flex;
  width: 100%;
  height: fit-content;
  align-items: center;
  justify-content: ${(props) => (props.sent ? 'flex-end' : 'flex-start')};
  overflow: hidden;
  flex: 0 0 auto;
  box-sizing: border-box;
  position: relative;
  z-index: 0;
  padding: ${(props) => (props.group ? '2px 10px' : '20px 10px 0 10px')};
  @media only screen and (max-width: 850px) {
    border-width: 2px 2px;
  }
`;

const BubbleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: fit-content;
  align-items: flex-end;
`;

const Bubble = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme, sent }) =>
    sent ? '#1982fc' : theme.message.bubble};
  border-radius: 14px;
  padding: 10px 10px;
  max-width: 60%;
  min-width: 30px;
  box-sizing: border-box;
  color: ${({ theme, sent }) => (sent ? 'white' : theme.font.primary)};
  z-index: 0;
  position: relative;
  font-size: 15px;
  word-break: break-word;
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

const Status = styled.div`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.font.secondary};
  font-size: 12px;
  margin-top: 3px;
  margin-right: 4px;
`;

export default MessageItem;
