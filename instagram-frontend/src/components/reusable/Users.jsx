import React, { useState, useEffect } from 'react';
import {
  FIND_ALL_USERS,
  FIND_USER_PROFILE,
} from '../../graphql/queries/userQueries';
import { useQuery } from '@apollo/client';

const Users = ({ username }) => {
  const [repositories, setRepositories] = useState();
  const [textInput, setInput] = useState('');
  const { loading, error, data } = useQuery(FIND_USER_PROFILE, {
    variables: { id: textInput },
  });

  useEffect(() => {
    console.log(data, 'error:', error);
    if (data && !loading && !error) {
      setRepositories(data);
    }
  }, [data]);

  return (
    <div>
      <input
        style={{ color: 'black' }}
        type="text"
        onChange={(e) => {
          setInput(e.target.value);
        }}
        value={textInput}
      />
      <button
        onClick={() => {
          console.log(repositories);
        }}
      >
        Click me
      </button>
    </div>
  );
};

export default Users;
