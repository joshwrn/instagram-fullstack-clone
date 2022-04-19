import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, Link, useHistory } from 'react-router-dom';

import logo from '../../assets/img/logo/logo-2.png';
import NavUserMenu from './NavUserMenu';
import Notifications from '../Notifications/Notifications';
import NavSearchBox from './NavSearchBox';
import UploadModal from '../reusable/UploadModal';

import { light, dark } from '../../functions/theme';
import stopScroll from '../../functions/stopScroll';

import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '@apollo/client';
import { NEW_NOTIFICATION } from '../../graphql/subscriptions/notificationSubscriptions';

import Styles from '../../styles/nav/nav.module.css';
import styled from 'styled-components';
import {
  IoHomeOutline,
  IoChatbubbleOutline,
  IoHeartOutline,
  IoPersonOutline,
  IoAddCircleOutline,
} from 'react-icons/io5';

const Nav = ({ theme, setTheme }) => {
  const { currentUser } = useAuth();

  const [openMenu, setOpenMenu] = useState(false);

  const [currentNotis, setCurrentNotis] = useState(0);
  const [openNoti, setOpenNoti] = useState(false);
  const [notiArray, setNotiArray] = useState([]);
  const {
    data: notiData,
    loading: notiLoading,
    error: notiError,
  } = useSubscription(NEW_NOTIFICATION);

  const [renderModal, setRenderModal] = useState(false);
  let history = useHistory();

  useEffect(() => {
    if (!notiData) return;
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

  return (
    <>
      {renderModal ? (
        <UploadModal getModal={getModal} />
      ) : (
        <StyledNav>
          <Inner>
            <Link to="/">
              <div className={Styles.logo}>
                <img className={Styles.logoImg} src={logo} alt="" />
                <h2>Instagram</h2>
              </div>
            </Link>
            {/*//+ search box */}
            <NavSearchBox Styles={Styles} />
            <IconsContainer>
              <NavLink exact to="/">
                <HomeIcon as={IoHomeOutline} />
              </NavLink>
              <NavLink exact to={currentUser ? '/messages' : '/sign-up'}>
                <Icon as={IoChatbubbleOutline} />
              </NavLink>
              <AddIcon as={IoAddCircleOutline} onClick={getModal} />
              {/*//+ notifications */}
              <div
                onClick={handleNoti}
                className={Styles.notiContainer}
                ref={notiRef}
              >
                <HeartIcon as={IoHeartOutline} />
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
                  <PersonIcon as={IoPersonOutline} onClick={handleUserIcon} />
                </NavLink>
                {openMenu && (
                  <NavUserMenu
                    theme={theme}
                    setTheme={setTheme}
                    setOpenMenu={setOpenMenu}
                  />
                )}
              </div>
            </IconsContainer>
          </Inner>
        </StyledNav>
      )}
    </>
  );
};

const StyledNav = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  width: 100%;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.background.nav};
  backdrop-filter: blur(32px);
  height: 54px;
  border-bottom: ${({ theme }) => theme.border.primary};
  box-shadow: 0px 0px 26px 5px rgba(0, 0, 0, 0.089);
  z-index: 100;
  box-sizing: border-box;
`;

const Inner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1600px;
  width: 100%;
  padding: 0 60px 0 60px;
  box-sizing: border-box;
`;

const IconsContainer = styled.div`
  display: flex;
  gap: 24px;
  justify-content: space-between;
  align-items: center;
`;

const Icon = styled.div`
  cursor: pointer;
  font-size: 1.5rem !important;
`;

const PersonIcon = styled(Icon)`
  transform: translateY(2px) translateX(-1px);
  font-size: 1.45rem !important;
`;

const HeartIcon = styled(Icon)`
  font-size: 1.65rem !important;
  transform: translateY(-1px);
`;

const HomeIcon = styled(Icon)`
  transform: translateY(1px);
  font-size: 1.5rem !important;
`;

const AddIcon = styled(Icon)`
  display: none;
`;

export default Nav;
