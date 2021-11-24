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
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  //const { data, loading: loadingUser } = useQuery(GET_CURRENT_USER);
  const [getUser, { loading: loadingUser, error, data }] =
    useLazyQuery(GET_CURRENT_USER);

  const client = useApolloClient();

  useEffect(() => {
    // removing this makes me unable to refresh the page
    // keeping it forces me to refresh the page
    getUser();
  }, []);

  useEffect(() => {
    console.log('auth context data:', data);
    if (data && data.getCurrentUser) {
      setCurrentUser(data.getCurrentUser);
    }
  }, [data]);

  const logout = async () => {
    setCurrentUser(null);
    localStorage.clear();
    await client.clearStore();
    window.location.replace(window.location.origin);
  };

  const value = {
    currentUser,
    setCurrentUser,
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
