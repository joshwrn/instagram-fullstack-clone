import React, { useState, useEffect } from 'react';

import NavSearchItem from './NavSearchItem';
import LoadingIcon from '../reusable/LoadingIcon';

import { useLazyQuery } from '@apollo/client';
import { SEARCH_USERS } from '../../graphql/queries/userQueries';

import Styles from '../../styles/nav/nav__search.module.css';

const NavSearch = ({
  searchInput,
  setOpenSearch,
  setSearchInput,
  setSearchValue,
  searchRef,
}) => {
  const [searchResults, setSearchResults] = useState([]);

  const [searchUsers, { data, loading }] = useLazyQuery(SEARCH_USERS);

  useEffect(() => {
    let handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setOpenSearch(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
    };
  }, []);

  useEffect(() => {
    if (data) {
      setSearchResults(data.searchUsers);
    }
  }, [data]);

  useEffect(() => {
    const search = async () => {
      if (searchInput !== '') {
        searchUsers({
          variables: {
            search: searchInput,
          },
        });
      }
    };
    search();
  }, [searchInput]);

  let searchInner;

  if (!loading) {
    searchInner = (
      <>
        {searchResults.length === 0 && (
          <p className={Styles.noResults}>No Results</p>
        )}
        {searchResults.map((item) => (
          <NavSearchItem
            key={item.username}
            setSearchInput={setSearchInput}
            setSearchValue={setSearchValue}
            setOpenSearch={setOpenSearch}
            item={item}
          />
        ))}
      </>
    );
  }

  return (
    <div ref={searchRef} className={Styles.container}>
      <div className={Styles.inner}>
        <LoadingIcon loading={loading} size={15} />
        {searchInner}
      </div>
    </div>
  );
};

export default NavSearch;
