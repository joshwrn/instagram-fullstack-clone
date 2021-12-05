import React from 'react';
import { Link } from 'react-router-dom';

import styled from 'styled-components';

const HomeCardCommentItem = ({ item }) => {
  return (
    <>
      {item && (
        <Comment>
          <Link to={`/profile/${item.user.id}`}>
            <User>{item.user.displayName}</User>
          </Link>
          {item.comment.length >= 15
            ? item.comment.substring(0, 50) + '...'
            : item.comment}
        </Comment>
      )}
    </>
  );
};

const Comment = styled.div`
  padding: 0 0 6px 0;
  height: 15px;
`;

const User = styled.span`
  font-weight: bold;
  cursor: pointer;
  margin-right: 5px;
`;

export default HomeCardCommentItem;
