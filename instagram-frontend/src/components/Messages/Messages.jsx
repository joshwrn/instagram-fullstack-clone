import React, { useEffect, useState, useRef, useCallback } from 'react';

import MessagesCreateMenu from './MessagesCreateMenu';
import MessageArea from './MessageArea';
import MessageInputBox from './MessageInputBox';
import MessagesSidebar from './MessagesSidebar';

import { useAuth } from '../../contexts/AuthContext';
import { useLazyQuery } from '@apollo/client';
import { GET_THREADS } from '../../graphql/queries/messageQueries';
import { NEW_MESSAGES } from '../../graphql/subscriptions/messageSubscriptions';

import Styles from '../../styles/messages/messages.module.css';

const Messages = ({ match }) => {
  const [messageThreads, setMessageThreads] = useState([]);
  const [currentThread, setCurrentThread] = useState();
  const [currentIndex, setCurrentIndex] = useState();
  const [createModal, setCreateModal] = useState(false);
  const { currentUser } = useAuth();
  const dummyRef = useRef(null);
  //const subRef = useRef();
  const [getThreads, { data, loading, error }] = useLazyQuery(GET_THREADS, {
    onError: (err) => console.log(err),
  });

  const scrollToBottom = (type) => {
    type === 'smooth'
      ? dummyRef.current?.scrollIntoView({ behavior: 'smooth' })
      : dummyRef.current?.scrollIntoView();
  };

  // create listener for messages
  useEffect(() => {
    if (data) {
      setMessageThreads(data.getThreads);
    }
  }, [data]);

  useEffect(() => {
    if (!messageThreads) return;
    if (messageThreads.length > 0) {
      setCurrentThread(messageThreads[0]);
      setCurrentIndex(0);
    }
  }, [messageThreads]);

  useEffect(() => {
    getThreads();
  }, [currentUser]);

  const getCurrentMessage = (num) => {
    setCurrentIndex(num);
    setCurrentThread(messageThreads[num]);
    scrollToBottom();
  };

  // creating messages from profile
  // useEffect(() => {
  //   if (match && messages && messages.length > 0) {
  //     const check = messages.some((item) => item.user === match.params.uid);
  //     if (!check) {
  //       setMessages([
  //         { user: match.params.uid, time: Date.now(), messages: [] },
  //         ...messages,
  //       ]);
  //     } else {
  //       const index = messages.findIndex(
  //         (item) => item.user === match.params.uid
  //       );
  //       getCurrentMessage(index);
  //     }
  //   }
  // }, [messages, match]);

  // on message update decide where
  // useEffect(() => {
  //   if (!match) {
  //     if (!currentMessage && messages && userProfile) {
  //       setCurrentMessage(messages[0]);
  //       setCurrentIndex(0);
  //       getCurrentMessage(0);
  //     } else if (currentMessage) {
  //       setCurrentMessage(messages[currentIndex]);
  //     }
  //     if (messages[0]?.messages?.length === 0) {
  //       getCurrentMessage(0);
  //     }
  //   }
  // }, [messages]);

  const handleCreate = (e) => {
    e.preventDefault();
    createModal ? setCreateModal(false) : setCreateModal(true);
  };

  return (
    <div className={Styles.messages}>
      {/*//+ create message menu */}
      {createModal && (
        <MessagesCreateMenu
          messageThreads={messageThreads}
          setMessageThreads={setMessageThreads}
          setCurrentMessage={setCurrentThread}
          userProfile={currentUser}
          handleCreate={handleCreate}
          setCurrentIndex={setCurrentIndex}
          getCurrentMessage={getCurrentMessage}
        />
      )}
      <div className={Styles.navBg} />
      {/*//+ sidebar */}
      <MessagesSidebar
        Styles={Styles}
        messageThreads={messageThreads}
        currentIndex={currentIndex}
        getCurrentMessage={getCurrentMessage}
        scrollToBottom={scrollToBottom}
        handleCreate={handleCreate}
      />
      {/*//+ input */}
      <div className={Styles.main}>
        <MessageInputBox
          currentThread={currentThread}
          setCurrentIndex={setCurrentIndex}
          Styles={Styles}
        />
        {/*//+ messages section */}
        <MessageArea
          currentThread={currentThread}
          threadId={currentThread?.id}
          Styles={Styles}
          dummyRef={dummyRef}
        />
      </div>
    </div>
  );
};

export default Messages;
