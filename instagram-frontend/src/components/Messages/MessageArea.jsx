import React, { useRef, useState, useEffect } from 'react';

import MessageItem from './MessageItem';

import useIntersect from '../../hooks/useIntersect';

import { useAuth } from '../../contexts/AuthContext';
import { useMutation, useSubscription } from '@apollo/client';
import { READ_MESSAGES } from '../../graphql/mutations/messageMutations';
import { NEW_MESSAGE } from '../../graphql/subscriptions/messageSubscriptions';

const MessageArea = ({ currentThread, Styles, dummyRef }) => {
  const topRef = useRef();
  const [thread, setThread] = useState([]);
  const [isFetching, setIsFetching] = useIntersect(topRef);
  const [readMessages, { data, loading, error }] = useMutation(READ_MESSAGES, {
    onError: (err) => console.log(err),
  });

  const {
    data: subData,
    loading: subLoad,
    error: subError,
  } = useSubscription(NEW_MESSAGE);

  useEffect(() => {
    console.log('sub', subData, subLoad, subError);
  }, [subData, subLoad, subError]);

  // useSubscription(NEW_MESSAGE, {
  //   onSubscriptionData: ({ subscriptionData }) => {
  //     console.log('new message');
  //   },
  //   onError: (err) => console.log(err),
  // });

  useEffect(() => {
    console.log('currentThread', currentThread);
  }, [currentThread]);

  useEffect(() => {
    if (!data) return;
    setThread(data.readMessages);
    console.log(data.readMessages);
  }, [data]);

  useEffect(() => {
    if (!currentThread) return;
    console.log('currentThread', currentThread);
    readMessages({
      variables: {
        thread: currentThread.id,
      },
    });
  }, [currentThread]);

  // //+ GET more from storage
  // const createFeed = () => {
  //   if (!currentThread) return;

  //   const reverse = currentThread.messages.slice(0).reverse();
  //   const sliced = reverse.slice(thread.length, thread.length + 20);
  //   const combine = [...thread, ...sliced];
  //   setThread(combine);
  // };

  // useEffect(() => {
  //   if (!isFetching) return;
  //   createFeed();
  // }, [isFetching]);

  //# after feed updates set load to false
  // useEffect(() => {
  //   setIsFetching(false);
  // }, [thread]);

  // useEffect(() => {
  //   if (currentThread?.messages?.length > 0) {
  //     const reverse = currentThread?.messages.slice(0).reverse();
  //     const sliced = reverse.slice(0, 20);
  //     setThread(sliced);
  //   } else {
  //     setThread([]);
  //   }
  // }, [currentThread]);

  return (
    <div id="msg" className={Styles.messageArea}>
      <div ref={dummyRef} className={Styles.dummy} />
      {thread?.map((item, index) => {
        return (
          <MessageItem
            key={item.id}
            time={item.date}
            recipient={item.recipient}
            sender={item.sender}
            thread={thread}
            index={index}
            message={item.message}
          />
        );
      })}
      <div ref={topRef} className={Styles.dummy} />
    </div>
  );
};

export default MessageArea;
