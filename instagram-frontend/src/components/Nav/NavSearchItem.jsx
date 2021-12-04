import React from 'react';
import { useHistory } from 'react-router-dom';

import ImageLoader from '../reusable/ImageLoader';

import Styles from '../../styles/nav/nav__search__item.module.css';

const NavSearchItem = ({
  item,
  setOpenSearch,
  setSearchInput,
  setSearchValue,
}) => {
  let history = useHistory();

  const handleClick = () => {
    setSearchInput('');
    setSearchValue('');
    history.push(`/profile/${item.id}`);
    setOpenSearch(false);
  };
  return (
    <div onClick={handleClick} className={Styles.container}>
      <div className={Styles.container}>
        <div className={Styles.start}>
          <div className={Styles.avatarContainer}>
            <ImageLoader
              borderRadius="100%"
              width="25px"
              height="25px"
              src={item.avatar}
            />
          </div>
          <div className={Styles.displayName}>{item.displayName}</div>
          <div className={Styles.type}>@{item.username}</div>
        </div>
      </div>
    </div>
  );
};

export default NavSearchItem;
