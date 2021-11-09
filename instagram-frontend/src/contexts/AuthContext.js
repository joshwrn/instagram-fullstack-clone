import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery, useLazyQuery } from '@apollo/client';
import { useApolloClient } from '@apollo/client';
import { GET_CURRENT_USER } from '../graphql/queries/authQueries';

// Create context
const AuthContext = React.createContext();

// Function allows you to use the context
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  //const { data, loading: loadingUser } = useQuery(GET_CURRENT_USER);
  const [getUser, { loading: loadingUser, error, data }] =
    useLazyQuery(GET_CURRENT_USER);

  const client = useApolloClient();

  useEffect(() => {
    const auth = localStorage.getItem('instagram-clone-auth');
    const user = localStorage.getItem('instagram-clone-user');
    if (auth) {
      setToken(auth);
    }
  }, []);

  useEffect(() => {
    if (data) {
      setCurrentUser(data.getCurrentUser);
    }
  }, [data]);

  useEffect(() => {
    if (token) {
      getUser();
    }
  }, [token]);

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  const value = {
    isAuthenticated,
    setIsAuthenticated,
    currentUser,
    setCurrentUser,
    token,
    setToken,
    loading,
    setLoading,
    logout,
  };

  // Takes all value props
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
