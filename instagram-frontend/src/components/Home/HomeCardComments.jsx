import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import HomeCardCommentItem from './HomeCardCommentItem';

import { useAuth } from '../../contexts/AuthContext';
import { useMutation } from '@apollo/client';
import { ADD_COMMENT } from '../../graphql/mutations/commentMutations';

import { IoSendOutline } from 'react-icons/io5';

const HomeCardComments = ({ Styles, post }) => {
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState([]);
  const { currentUser } = useAuth();
  const [addComment] = useMutation(ADD_COMMENT, {
    onError: (err) => {
      console.log(err);
    },
  });

  useEffect(() => {
    if (!post) return;
    const temp = [...post.comments];
    setComments(temp.reverse());
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const comment = commentInput.trim();
    if (comment.length > 0) {
      setComments((prev) => [
        comments.length > 0 && prev[0],
        {
          user: {
            id: currentUser.id,
            displayName: currentUser.displayName,
          },
          comment: comment,
          id: Math.random(),
        },
      ]);
      setCommentInput('');

      console.log({ post: post.id, comment: comment });
      await addComment({ variables: { post: post.id, comment: comment } });
    }
  };

  return (
    <>
      <div className={Styles.comments}>
        <Link
          className={Styles.imageLink}
          to={`/Post/${post.user.id}/${post.id}`}
        >
          <p className={Styles.viewAll}>
            {post.comments.length === 0 ? 'No Comments' : 'View All Comments'}
          </p>
        </Link>
        <div className={Styles.commentContainer}>
          {comments.map((item) => {
            return (
              <HomeCardCommentItem key={item.id} item={item} Styles={Styles} />
            );
          })}
        </div>
      </div>
      <div className={Styles.commentBox}>
        <form className={Styles.commentForm} onSubmit={handleSubmit}>
          <input
            className={Styles.inputBox}
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            type="text"
            placeholder="Add a comment..."
            maxLength="99"
          />
        </form>
        <IoSendOutline onClick={handleSubmit} className={Styles.send} />
      </div>
    </>
  );
};

export default HomeCardComments;
