import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { LOGIN } from '../../graphql/mutations/authMutations';
import { GET_CURRENT_USER } from '../../graphql/queries/authQueries';
import { useMutation, useLazyQuery } from '@apollo/client';

import Styles from '../../styles/sign-up/login.module.css';

const Login = () => {
  const { setToken, token, logout, currentUser, setCurrentUser } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [getUser, { loading, error, data }] = useLazyQuery(GET_CURRENT_USER);

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem('instagram-clone-auth', token);
    }
  }, [result.data]); // eslint-disable-line

  useEffect(() => {
    console.log(error, loading);
  }, [error, loading]);

  useEffect(() => {
    if (token) {
      getUser();
    }
  }, [token]);

  useEffect(() => {
    console.log('data:', data);
    if (data) {
      setCurrentUser(data.getCurrentUser);
    }
  }, [data]);

  const submit = async (event) => {
    event.preventDefault();
    console.log('sign in');
    login({ variables: { username, password } });
  };

  return (
    <div className={Styles.container}>
      username
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      password
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <img className={Styles.img} src={avatar} alt="" />
      <div>{currentUser?.username}</div>
      <button onClick={submit}>login</button>
      <button onClick={() => logout()}>logout</button>
      <button onClick={() => console.log(data)}>check</button>
    </div>
  );
};

export default Login;
