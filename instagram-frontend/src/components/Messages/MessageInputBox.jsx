import React, { useState } from 'react';

import { useAuth } from '../../contexts/AuthContext';
import { useMutation } from '@apollo/client';
import { CREATE_MESSAGE } from '../../graphql/mutations/messageMutations';

import { IoSendOutline } from 'react-icons/io5';

const MessageInputBox = ({ currentThread, Styles, setCurrentIndex }) => {
  const [inputBox, setInputBox] = useState('');
  const { currentUser } = useAuth();
  const [createMessage] = useMutation(CREATE_MESSAGE, {
    onError: (err) => {
      console.log(err);
    },
  });
  //+ send
  // remember to set current index to 0
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trim = inputBox.trim();
    if (!currentUser || trim === '') return;
    await createMessage({
      variables: {
        message: trim,
        recipientId: currentThread.otherUser.id,
      },
    });
    setInputBox('');
    setCurrentIndex(0);
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
