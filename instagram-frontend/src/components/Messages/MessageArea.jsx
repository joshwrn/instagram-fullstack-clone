import React, { useRef, useState, useEffect } from 'react';

import MessageItem from './MessageItem';

import useIntersect from '../../hooks/useIntersect';
import updateCacheWith from '../../functions/updateCache';

import { useAuth } from '../../contexts/AuthContext';
import {
  useMutation,
  useLazyQuery,
  useQuery,
  useSubscription,
  useApolloClient,
} from '@apollo/client';
import { READ_MESSAGES } from '../../graphql/mutations/messageMutations';
import { NEW_MESSAGE } from '../../graphql/subscriptions/messageSubscriptions';

const MessageArea = ({ currentThread, Styles, dummyRef, threadId }) => {
  const topRef = useRef();
  const client = useApolloClient();
  const [thread, setThread] = useState([]);
  const [isFetching, setIsFetching] = useIntersect(topRef);
  const [readMessages, { data, loading, error }] = useLazyQuery(READ_MESSAGES, {
    onError: (err) => console.log(err),
  });

  const {
    data: subData,
    loading: subLoad,
    error: subError,
  } = useSubscription(NEW_MESSAGE, {
    variables: { threadId: currentThread ? currentThread.id : null },
  });

  useEffect(() => {
    if (!subData) return;
    const newMessage = subData.newMessage;
    updateCacheWith(
      client,
      newMessage,
      READ_MESSAGES,
      { threadId: currentThread.id },
      'readMessages'
    );
  }, [subData, subLoad, subError]);

  useEffect(() => {
    if (!data) return;
    setThread(data.readMessages);
  }, [data]);

  useEffect(() => {
    if (!currentThread) return;
    readMessages({
      variables: {
        threadId: currentThread.id,
      },
    });
  }, [currentThread]);

  return (
    <div id="msg" className={Styles.messageArea}>
      <div ref={dummyRef} className={Styles.dummy} />
      {thread?.map((item, index) => {
        return (
          <MessageItem
            key={item.id}
            seen={item.seen}
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
