import React from 'react';
import { Link } from 'react-router-dom';

const HomeCardCommentItem = ({ Styles, item }) => {
  return (
    <>
      {item && (
        <p className={Styles.comment}>
          <Link to={`/profile/${item.user.id}`}>
            <span className={Styles.commentUser}>{item.user.displayName}</span>
          </Link>
          {item.comment.length >= 15
            ? item.comment.substring(0, 50) + '...'
            : item.comment}
        </p>
      )}
    </>
  );
};

export default HomeCardCommentItem;
