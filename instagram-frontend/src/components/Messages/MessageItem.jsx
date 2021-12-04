import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import ImageLoader from '../reusable/ImageLoader';

import convertTime from '../../functions/convertTime';

import { useAuth } from '../../contexts/AuthContext';

import styled from 'styled-components';

const MessageItem = ({
  recipient,
  sender,
  message,
  thread,
  seen,
  date,
  index,
  cursorRef,
}) => {
  const [sent, setSent] = useState(false);
  const [group, setGroup] = useState(true);
  const [time, setTime] = useState('');
  const [showTime, setShowTime] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!date) return;
    const converted = convertTime(date, Date.now());
    setTime(converted);
  }, [date]);

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
    <ItemDiv ref={cursorRef} group={group} sent={sent} loaded={loaded}>
      {loaded && (
        <>
          <BubbleWrapper>
            <Bubble
              onMouseEnter={() => setShowTime(true)}
              onMouseLeave={() => setShowTime(false)}
              sent={sent}
            >
              {message}
            </Bubble>
            <Time showTime={showTime}>{time}</Time>
            {index === 0 && <Status>{seen}</Status>}
          </BubbleWrapper>
          <SideContainer>
            {!group && currentUser && (
              <Link to={`/profile/${sent ? currentUser.id : sender.id}`}>
                <ImageLoader
                  height="38px"
                  width="38px"
                  borderRadius="100%"
                  src={sent ? currentUser.avatar : sender.avatar}
                />
              </Link>
            )}
          </SideContainer>
        </>
      )}
    </ItemDiv>
  );
};

const ItemDiv = styled.div`
  display: flex;
  width: 100%;
  height: fit-content;
  align-items: center;
  justify-content: ${(props) => (props.sent ? 'flex-end' : 'flex-start')};
  flex: 0 0 auto;
  box-sizing: border-box;
  position: relative;
  transition: opacity 0.5s ease-in-out;
  opacity: ${(props) => (props.loaded ? '1' : '0')};
  padding: ${(props) => (props.group ? '2px 10px' : '20px 10px 0 10px')};
  @media only screen and (max-width: 850px) {
    border-width: 2px 2px;
  }
`;

const SideContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 50px;
  height: 100%;
  background-color: ${(props) => props.theme.background.primary};
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
  margin-right: 5px;
`;

const Time = styled(Status)`
  opacity: ${(props) => (props.showTime ? '1' : '0')};
  visibility: ${(props) => (props.showTime ? 'visible' : 'hidden')};
  transition: opacity 0.25s ease 0.15s, height 0.15s ease-out;
  height: ${(props) => (props.showTime ? '12px' : '0px')};
`;

const BubbleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: fit-content;
  align-items: flex-end;
  position: relative;
`;

const Bubble = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme, sent }) =>
    sent ? '#1982fc' : theme.message.bubble};
  border-radius: 18px;
  padding: 10px 13px;
  max-width: 60%;
  min-width: 41px;
  box-sizing: border-box;
  color: ${({ theme, sent }) => (sent ? 'white' : theme.font.primary)};
  position: relative;
  font-size: 15px;
  transition: margin-bottom 0.25s ease;
  @media only screen and (max-width: 850px) {
    max-width: ${(props) => (props.sent ? '75%' : '80%')};
  }
  &:before {
    content: '';
    position: absolute;
    width: 100%;
    bottom: -20px;
    height: 0px;
    z-index: 100;
  }
  &:hover {
    &:before {
      height: 30px;
    }
  }
`;

export default MessageItem;
