import React, { useState, useEffect } from 'react';

import MessageItem from './MessageItem';
import LoadingIcon from '../reusable/LoadingIcon';

import useCursor from '../../hooks/useCursor';

import { useLazyQuery, useSubscription, useApolloClient } from '@apollo/client';
import { READ_MESSAGES } from '../../graphql/mutations/messageMutations';
import { NEW_MESSAGE } from '../../graphql/subscriptions/messageSubscriptions';

import { useTheme } from 'styled-components';

const MessageArea = ({ currentIndex, currentThread, Styles, dummyRef }) => {
  const client = useApolloClient();
  const theme = useTheme();
  const [thread, setThread] = useState([]);
  const [end, setEnd] = useState(false);
  const [readMessages, { data, loading, error, fetchMore }] = useLazyQuery(
    READ_MESSAGES,
    {
      onError: (err) => console.log(err),
    }
  );
  const [isFetching, setIsFetching, cursorRef] = useCursor(end, loading);

  // get initial messages
  useEffect(() => {
    if (!currentThread) return;
    readMessages({
      variables: {
        threadId: currentThread.id,
        skip: 0,
        limit: 25,
      },
    });
  }, [currentThread]);

  useEffect(() => {
    setThread([]);
  }, [currentIndex]);

  // set the thread and whether or not the end of the thread has been reached
  useEffect(() => {
    if (!data) return;
    if (data.readMessages.hasMore === false) {
      setEnd(true);
    }
    const sortedMessages = [...data.readMessages.messages].sort((a, b) => {
      return b.date - a.date;
    });
    setThread(sortedMessages);
    setIsFetching(false);
  }, [data]);

  // fetch more messages
  useEffect(() => {
    if (!isFetching || !data) return;
    fetchMore({
      variables: {
        threadId: currentThread.id,
        skip: thread.length,
        limit: 25,
      },
    });
  }, [isFetching]);

  //subscribe to new messages
  const {
    data: subData,
    loading: subLoad,
    error: subError,
  } = useSubscription(NEW_MESSAGE, {
    variables: { threadId: currentThread ? currentThread.id : null },
  });

  // update the thread when a new message is received
  useEffect(() => {
    if (!subData) return;
    const newMessage = subData.newMessage;
    const includedIn = (set, object) => {
      console.log(set, object);
      set.map((p) => p.id).includes(object.id);
    };
    const dataInStore = client.readQuery({
      query: READ_MESSAGES,
      variables: { threadId: currentThread.id, limit: 25, skip: 0 },
    });
    if (!dataInStore) return;
    if (!includedIn(dataInStore.readMessages.messages, newMessage)) {
      client.writeQuery({
        query: READ_MESSAGES,
        variables: { threadId: currentThread.id, limit: 25, skip: 0 },
        data: {
          readMessages: {
            hasMore: dataInStore.readMessages.hasMore,
            messages: [newMessage],
          },
        },
      });
    }
  }, [subData, subLoad, subError]);

  return (
    <div id="msg" className={Styles.messageArea}>
      <div ref={dummyRef} className={Styles.dummy} />
      {thread?.map((item, index) => {
        return (
          <MessageItem
            key={item.id}
            seen={item.seen ? 'seen' : 'unseen'}
            date={item.date}
            recipient={item.recipient}
            sender={item.sender}
            thread={thread}
            index={index}
            message={item.message}
            cursorRef={index + 1 === thread.length ? cursorRef : null}
          />
        );
      })}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: theme.background.primary,
        }}
      >
        <LoadingIcon isFetching={isFetching} loading={loading} end={end} />
      </div>
    </div>
  );
};

export default MessageArea;
