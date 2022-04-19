import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

import MessagesCreateMenu from './MessagesCreateMenu';
import MessageArea from './MessageArea';
import MessageInputBox from './MessageInputBox';
import MessagesSidebar from './MessagesSidebar';

import { useAuth } from '../../contexts/AuthContext';
import { useLazyQuery } from '@apollo/client';
import {
  GET_THREADS,
  GET_NEW_CONTACT,
} from '../../graphql/queries/messageQueries';

import Styles from '../../styles/messages/messages.module.css';

const Messages = () => {
  const [messageThreads, setMessageThreads] = useState([]);
  const [currentThread, setCurrentThread] = useState();
  const [currentIndex, setCurrentIndex] = useState();
  const [createModal, setCreateModal] = useState(false);

  const { currentUser } = useAuth();
  const params = useParams();

  const dummyRef = useRef(null);
  const [getThreads, { data, loading, error }] = useLazyQuery(GET_THREADS, {
    onError: (err) => console.log(err),
  });
  const [getNewContact, { data: newContactData }] = useLazyQuery(
    GET_NEW_CONTACT,
    {
      onError: (err) => console.log(err),
    }
  );

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

  // message creation from profile
  useEffect(() => {
    if (params.uid && !loading) {
      const check = messageThreads.find((thread) => {
        return thread.otherUser.id === params.uid;
      });
      if (check) {
        getCurrentMessage(messageThreads.indexOf(check));
      } else {
        getNewContact({ variables: { id: params.uid } });
      }
    }
  }, [params]);

  useEffect(() => {
    if (newContactData) {
      setMessageThreads([
        {
          otherUser: {
            id: newContactData.findUser.id,
            displayName: newContactData.findUser.displayName,
            avatar: newContactData.findUser.avatar,
          },
          date: Date.now(),
          messages: [],
          id: Math.random(),
        },
        ...messageThreads,
      ]);
    }
  }, [newContactData]);

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
          currentIndex={currentIndex}
          threadId={currentThread?.id}
          Styles={Styles}
          dummyRef={dummyRef}
        />
      </div>
    </div>
  );
};

export default Messages;
