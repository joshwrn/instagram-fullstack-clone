import React, { useState } from 'react';

import { useAuth } from '../../contexts/AuthContext';
import { useMutation, useApolloClient } from '@apollo/client';
import {
  CREATE_MESSAGE,
  READ_MESSAGES,
} from '../../graphql/mutations/messageMutations';

import { IoSendOutline } from 'react-icons/io5';

const MessageInputBox = ({ currentThread, Styles, setCurrentIndex }) => {
  const [inputBox, setInputBox] = useState('');
  const { currentUser } = useAuth();
  const client = useApolloClient();
  const [createMessage] = useMutation(CREATE_MESSAGE, {
    onError: (err) => {
      console.log(err);
    },
    update: (store, response) => {
      const includedIn = (set, object) => {
        set.map((p) => p.id).includes(object.id);
      };
      const dataInStore = client.readQuery({
        query: READ_MESSAGES,
        variables: { threadId: currentThread.id, limit: 25, skip: 0 },
      });
      if (!dataInStore) return;
      if (
        !includedIn(
          dataInStore.readMessages.messages,
          response.data.createMessage
        )
      ) {
        client.writeQuery({
          query: READ_MESSAGES,
          variables: { threadId: currentThread.id, limit: 25, skip: 0 },
          data: {
            readMessages: {
              hasMore: dataInStore.readMessages.hasMore,
              messages: [response.data.createMessage],
            },
          },
        });
      }
    },
  });
  //+ send
  // remember to set current index to 0
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trim = inputBox.trim();
    if (!currentUser || trim === '') return;
    setInputBox('');
    await createMessage({
      variables: {
        message: trim,
        recipientId: currentThread.otherUser.id,
      },
    });
  };

  return (
    <div className={Styles.messageBox}>
      {/* arranged in reverse because of flex direction */}
      <form onSubmit={handleSubmit} className={Styles.messageForm}>
        <input
          className={Styles.input}
          type="text"
          maxLength="500"
          minLength="1"
          placeholder="New Message..."
          onChange={(e) => setInputBox(e.target.value)}
          value={inputBox}
        />
      </form>
      <IoSendOutline
        type="submit"
        onClick={handleSubmit}
        className={Styles.send}
      />
    </div>
  );
};

export default MessageInputBox;
