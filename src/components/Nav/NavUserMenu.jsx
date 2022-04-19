import React from 'react';
import { NavLink, Link } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { useMutation } from '@apollo/client';
import { CHANGE_THEME } from '../../graphql/mutations/userMutations';

import Styles from '../../styles/nav/nav__user-menu.module.css';
import { light, dark } from '../../functions/theme';
import { CgDarkMode } from 'react-icons/cg';
import {
  IoPersonCircleOutline,
  IoPersonAddOutline,
  IoLogOut,
} from 'react-icons/io5';

const NavUserMenu = ({ setOpenMenu, theme, setTheme }) => {
  const { currentUser, logout } = useAuth();
  const [changeTheme] = useMutation(CHANGE_THEME);
  const handleClick = (e) => {
    e.preventDefault();
    setOpenMenu(false);
  };

  const handleTheme = async (e) => {
    e.preventDefault();
    if (theme === 'light') {
      dark();
      setTheme('dark');
      if (currentUser) {
        await changeTheme();
      }
    } else if (theme === 'dark') {
      light();
      setTheme('light');
      if (currentUser) {
        await changeTheme();
      }
    }
  };

  return (
    <div onClick={handleClick} className={Styles.container}>
      <div className={Styles.inner}>
        {currentUser ? (
          <>
            <NavLink
              className={Styles.option}
              to={`/profile/${currentUser.id}`}
            >
              <IoPersonCircleOutline className={Styles.icon} />
              <div>
                <p>Profile</p>
              </div>
            </NavLink>
            <div onClick={handleTheme} className={Styles.option}>
              <CgDarkMode className={Styles.icon} />
              <p>Change Theme</p>
            </div>
            <div onClick={logout} className={Styles.option}>
              <IoLogOut className={Styles.icon} />
              <p>Logout</p>
            </div>
          </>
        ) : (
          <>
            <Link className={Styles.option} to="/sign-up">
              <IoPersonAddOutline className={Styles.icon} />
              <div>
                <p>Sign Up</p>
              </div>
            </Link>
            <div onClick={handleTheme} className={Styles.option}>
              <CgDarkMode className={Styles.icon} />
              <p>Change Theme</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NavUserMenu;
