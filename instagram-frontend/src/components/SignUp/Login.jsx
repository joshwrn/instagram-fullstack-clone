import React, { useEffect, useState, useCallback } from 'react';

import { LOGIN } from '../../graphql/mutations/authMutations';
import { useMutation, useLazyQuery } from '@apollo/client';

import Styles from '../../styles/sign-up/login.module.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error);
    },
  });

  // set the token in state and local storage
  useEffect(() => {
    if (result.data) {
      console.log('set token and local storage');
      const newToken = result.data.login.value;
      localStorage.setItem('instagram-clone-auth', newToken);
      window.location.replace(window.location.origin);
    }
  }, [result.data]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('sign in');
    login({ variables: { username, password } });
  };

  return (
    <div className={Styles.login}>
      <div className={Styles.image}></div>
      <div className={Styles.container}>
        <div className={Styles.formContainer}>
          <form pattern="[0-9a-zA-Z_.-]*" className={Styles.form}>
            <div className={Styles.header}>
              <div className={Styles.textContainer}>
                <h2 className={Styles.headerText}>Login</h2>
              </div>
            </div>

            <div className={Styles.inputLabelDiv}>
              <p className={Styles.inputLabel}>Username</p>
            </div>
            <div className={Styles.input}>
              <div className={Styles.username}>
                <p>@</p>
              </div>
              <input
                required
                autoComplete="off"
                className={Styles.searchInputBox}
                type="text"
                name="username"
                placeholder="username"
                maxLength="15"
                minLength="3"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className={Styles.inputLabelDiv}>
              <p className={Styles.inputLabel}>Password</p>
            </div>

            <div className={Styles.input}>
              <input
                required
                onChange={(e) => setPassword(e.target.value)}
                className={Styles.inputBox}
                type="password"
                name="password"
                placeholder="********"
                maxLength="16"
                minLength="5"
                value={password}
              />
            </div>
            <button
              type="submit"
              onClick={
                username && password ? handleSubmit : (e) => e.preventDefault()
              }
              className={Styles.signUpButton}
              style={
                username && password
                  ? {
                      backgroundColor: 'black',
                      cursor: 'pointer',
                    }
                  : { backgroundColor: 'gray', cursor: 'not-allowed' }
              }
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
