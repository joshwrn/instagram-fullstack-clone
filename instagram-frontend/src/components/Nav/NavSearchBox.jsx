import React, { useState, useCallback, useRef, useEffect } from 'react';
import NavSearch from './NavSearch';
import debounce from '../../functions/debounce';

import Styles from '../../styles/nav/nav.module.css';

import styled from 'styled-components';

const SearchInput = styled.input`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0em 1em 0 1em;
  background: rgba(32, 32, 32, 0);
  border: 1px solid rgba(124, 124, 124, 0.281);
  border-radius: 8px;
  gap: 8px;
  text-align: center;
  height: 28px;
  transition: width 0.5s;
  box-sizing: border-box;
  width: 175px;
  color: var(--secondary-font-color);
  &:focus {
    width: 250px;
    color: var(--primary-font-color);
    &::placeholder {
      color: transparent;
    }
  }
`;

const NavSearchBox = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [openSearch, setOpenSearch] = useState(false);

  const debounceChange = useCallback(
    debounce((nextValue) => setSearchInput(nextValue), 500),
    []
  );

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    debounceChange(e.target.value);
  };

  const searchRef = useRef();

  return (
    <div className={Styles.search}>
      <form autoComplete="off">
        <SearchInput
          open={openSearch}
          ref={searchRef}
          onChange={handleSearch}
          onClick={() => setOpenSearch(true)}
          value={searchValue}
          type="text"
          placeholder="Search"
        />
      </form>
      {openSearch && searchInput !== '' && (
        <NavSearch
          setSearchInput={setSearchInput}
          setSearchValue={setSearchValue}
          searchInput={searchInput}
          setOpenSearch={setOpenSearch}
          searchRef={searchRef}
        />
      )}
    </div>
  );
};

export default NavSearchBox;
