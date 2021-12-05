import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import HomeCardCommentItem from './HomeCardCommentItem';

import { useAuth } from '../../contexts/AuthContext';
import { useMutation } from '@apollo/client';
import { ADD_COMMENT } from '../../graphql/mutations/commentMutations';

import { IoSendOutline } from 'react-icons/io5';

import styled from 'styled-components';

const HomeCardComments = ({ post }) => {
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

      await addComment({ variables: { post: post.id, comment: comment } });
    }
  };

  return (
    <>
      <Outer>
        <Link to={`/Post/${post.user.id}/${post.id}`}>
          <ViewAll>
            {comments.length === 0 ? 'No Comments' : 'View All Comments'}
          </ViewAll>
        </Link>
        <CommentsContainer>
          {comments.map((item) => {
            return <HomeCardCommentItem key={item.id} item={item} />;
          })}
        </CommentsContainer>
      </Outer>
      <CommentBox>
        <CommentForm onSubmit={handleSubmit}>
          <InputBox
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            type="text"
            placeholder="Add a comment..."
            maxLength="99"
          />
        </CommentForm>
        <Send onClick={handleSubmit} />
      </CommentBox>
    </>
  );
};

const Outer = styled.div`
  font-size: 13.6px;
`;

const ViewAll = styled.p`
  color: ${({ theme }) => theme.font.secondary};
  margin: 0 0 6px 0;
  cursor: pointer;
`;

const CommentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 48px;
  width: 100%;
`;

const CommentBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  background: transparent;
  border: 1px solid transparent;
  border-top: 1px solid rgba(124, 124, 124, 0.281);
  padding-top: 10px;
`;

const CommentForm = styled.form`
  width: 100%;
  input {
    &::placeholder {
      font-size: 13px;
    }
  }
`;

const InputBox = styled.input`
  width: 100%;
  text-align: left;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.font.primary};
`;

const Send = styled(IoSendOutline)`
  cursor: pointer;
`;

export default HomeCardComments;
