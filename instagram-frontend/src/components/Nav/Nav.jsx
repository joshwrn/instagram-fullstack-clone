import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, Link, useHistory } from 'react-router-dom';

import logo from '../../assets/img/logo/logo-2.png';
import NavUserMenu from './NavUserMenu';
import Notifications from '../Notifications/Notifications';
import NavSearch from './NavSearch';
import UploadModal from '../reusable/UploadModal';

import { light, dark } from '../../functions/theme';
import debounce from '../../functions/debounce';
import stopScroll from '../../functions/stopScroll';
import jc from '../../functions/joinClasses';

import { useAuth } from '../../contexts/AuthContext';
import { useQuery, useSubscription } from '@apollo/client';
import { NEW_NOTIFICATION } from '../../graphql/subscriptions/notificationSubscriptions';

import Styles from '../../styles/nav/nav.module.css';
import {
  IoHomeOutline,
  IoChatbubbleOutline,
  IoHeartOutline,
  IoPersonOutline,
  IoAddCircleOutline,
} from 'react-icons/io5';

const Nav = () => {
  const { currentUser } = useAuth();

  const [theme, setTheme] = useState('light');
  const [openMenu, setOpenMenu] = useState(false);

  const [currentNotis, setCurrentNotis] = useState(0);
  const [openNoti, setOpenNoti] = useState(false);
  const [notiArray, setNotiArray] = useState([]);
  const {
    data: notiData,
    loading: notiLoading,
    error: notiError,
  } = useSubscription(NEW_NOTIFICATION);

  const [openSearch, setOpenSearch] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const [renderModal, setRenderModal] = useState(false);
  let history = useHistory();

  useEffect(() => {
    console.log('notiData', notiData);
    setCurrentNotis((prev) => prev + 1);
  }, [notiData]);

  const getModal = (e) => {
    e.preventDefault();
    if (!currentUser) return history.push('/sign-up');
    renderModal ? setRenderModal(false) : setRenderModal(true);
    stopScroll(renderModal);
  };

  const handleUserIcon = (e) => {
    e.preventDefault();
    openMenu ? setOpenMenu(false) : setOpenMenu(true);
  };

  const handleNoti = async () => {
    if (!currentUser) return history.push('/sign-up');
    if (openNoti) {
      setOpenNoti(false);
      setNotiArray([]);
    } else {
      setCurrentNotis(0);
      setOpenNoti(true);
      // remove notifications here
    }
  };

  let menuRef = useRef();
  let notiRef = useRef();

  useEffect(() => {
    let handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }

      if (notiRef.current && !notiRef.current.contains(e.target)) {
        setOpenNoti(false);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
    };
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.notiCount) {
      setCurrentNotis(currentUser.notiCount);
    }
    if (currentUser && currentUser.theme) {
      if (currentUser.theme === 'dark') {
        dark();
        setTheme('dark');
      } else if (currentUser.theme === 'light') {
        light();
        setTheme('light');
      }
    }
  }, [currentUser]);

  const debounceChange = useCallback(
    debounce((nextValue) => setSearchInput(nextValue), 500),
    []
  );

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    debounceChange(e.target.value);
  };

  const searchRef = useRef();

  const handleSearchModal = (e) => {
    e.preventDefault();
    !openSearch && setOpenSearch(true);
  };

  return (
    <>
      {renderModal ? (
        <UploadModal getModal={getModal} />
      ) : (
        <div className={Styles.nav}>
          <div className={Styles.inner}>
            <Link to="/">
              <div className={Styles.logo}>
                <img className={Styles.logoImg} src={logo} alt="" />
                <h2>Instagram</h2>
              </div>
            </Link>
            {/*//+ search box */}
            <div className={Styles.search}>
              <form autoComplete="off">
                <input
                  ref={searchRef}
                  onChange={handleSearch}
                  value={searchValue}
                  className={Styles.searchInput}
                  onClick={handleSearchModal}
                  type="text"
                  placeholder="Search"
                />
              </form>
              {openSearch && searchInput !== '' ? (
                <NavSearch
                  setSearchInput={setSearchInput}
                  searchInput={searchInput}
                  setOpenSearch={setOpenSearch}
                  searchRef={searchRef}
                />
              ) : null}
            </div>
            <div className={Styles.icons}>
              <NavLink exact to="/">
                <IoHomeOutline className={jc(Styles.icon, Styles.home)} />
              </NavLink>
              <NavLink exact to={currentUser ? '/messages' : '/sign-up'}>
                <IoChatbubbleOutline className={jc(Styles.icon, Styles.chat)} />
              </NavLink>
              <IoAddCircleOutline
                onClick={getModal}
                className={jc(Styles.icon, Styles.add)}
              />
              {/*//+ notifications */}
              <div
                onClick={handleNoti}
                className={Styles.notiContainer}
                ref={notiRef}
              >
                <IoHeartOutline className={jc(Styles.icon, Styles.heart)} />
                {currentNotis > 0 ? (
                  <div className={Styles.notiBadge}>{currentNotis}</div>
                ) : null}
                {openNoti && (
                  <Notifications
                    notiArray={notiArray}
                    setNotiArray={setNotiArray}
                    setCurrentNotis={setCurrentNotis}
                    handleNoti={handleNoti}
                  />
                )}
              </div>
              {/*//+ profile menu */}
              <div className="user-menu-container" ref={menuRef}>
                <NavLink
                  className={Styles.profileLink}
                  onClick={(e) => e.preventDefault()}
                  exact
                  to={`/profile/${currentUser?.id}`}
                >
                  <IoPersonOutline
                    onClick={handleUserIcon}
                    className={jc(Styles.icon, Styles.person)}
                  />
                </NavLink>
                {openMenu && (
                  <NavUserMenu
                    theme={theme}
                    setTheme={setTheme}
                    setOpenMenu={setOpenMenu}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Nav;
