import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { DELETE_POST } from '../../graphql/mutations/postMutations';
import { useMutation } from '@apollo/client';

import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { IoShareSocialOutline, IoTrashOutline } from 'react-icons/io5';
import Styles from '../../styles/post/post__menu.module.css';

const PostMenu = ({ ownPost, currentPostId }) => {
  const history = useHistory();
  const params = useParams();
  const menuRef = useRef();
  const [menuStatus, setMenuStatus] = useState(false);
  const [deletePost, { data }] = useMutation(DELETE_POST, {
    update(cache) {
      const normalizedId = cache.identify({
        id: currentPostId,
        __typename: 'ProfilePost',
      });
      cache.evict({ id: normalizedId });
      cache.gc();
    },
  });

  const handleMenu = () => {
    menuStatus ? setMenuStatus(false) : setMenuStatus(true);
  };

  const handleDelete = async () => {
    await deletePost({
      variables: {
        id: currentPostId,
      },
    });
  };

  useEffect(() => {
    if (data && data.deletePost === 'success') {
      history.push(`/profile/${params.uid}`);
    }
  }, [data]);

  const handleShare = () => {
    copyToClipboard(window.location.href);
    setMenuStatus(false);
  };

  const copyToClipboard = (content) => {
    const el = document.createElement('textarea');
    el.value = content;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  useEffect(() => {
    let handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuStatus(false);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
    };
  }, []);

  let menu;

  menu = (
    <div className={ownPost ? Styles.containerOwn : Styles.container}>
      <div className={Styles.inner}>
        <div onClick={handleShare} className={Styles.option}>
          <IoShareSocialOutline className={Styles.icon} />
          <div>
            <p>Copy Link</p>
          </div>
        </div>
        {ownPost ? (
          <div className={Styles.option} onClick={handleDelete}>
            <IoTrashOutline className={Styles.icon} />
            <p>Delete</p>
          </div>
        ) : null}
      </div>
    </div>
  );

  return (
    <div ref={menuRef} onClick={handleMenu}>
      {menuStatus ? menu : null}
      <MoreHorizIcon className={Styles.postIcon} />
    </div>
  );
};

export default PostMenu;
