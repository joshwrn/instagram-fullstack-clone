import React from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';

import Styles from '../../styles/home/home__login.module.css';

const LoginButton = () => {
  const { currentUser } = useAuth();

  return (
    <div>
      {!currentUser && (
        <div className={Styles.loginButtons}>
          <Link to="/sign-up">
            <button className={Styles.signUp}>Sign Up</button>
          </Link>
          <Link to="/login">
            <button className={Styles.login}>Login</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default LoginButton;
