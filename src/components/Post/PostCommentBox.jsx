import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { ADD_COMMENT } from '../../graphql/mutations/commentMutations';
import { useMutation } from '@apollo/client';

const PostCommentBox = ({ Styles, IoSendOutline, match, setComments }) => {
  const [input, setInput] = useState('');
  let history = useHistory();
  const { currentUser } = useAuth();
  const [addComment] = useMutation(ADD_COMMENT, {
    onError: (error) => {
      console.log(error);
    },
    refetchQueries: [`findPost`],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentUser && input.trim() !== '') {
      setComments((prev) => [
        {
          post: match.params.id,
          comment: input,
          user: {
            id: currentUser.id,
            displayName: currentUser.displayName,
            avatar: currentUser.avatar,
          },
          date: Date.now(),
        },
        ...prev,
      ]);
      setInput('');
      addComment({
        variables: {
          comment: input,
          post: match.params.postid,
        },
      });
    } else if (!currentUser) {
      history.push('/sign-up');
    }
  };

  return (
    <div className={Styles.commentBox}>
      <form className={Styles.commentForm} onSubmit={handleSubmit}>
        <input
          onChange={(e) => setInput(e.target.value)}
          className={Styles.input}
          type="text"
          value={input}
          maxLength="99"
          minLength="1"
          placeholder="Add a comment..."
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

export default PostCommentBox;
