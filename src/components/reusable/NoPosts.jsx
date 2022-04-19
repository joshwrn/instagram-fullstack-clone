import React from 'react';

import styled from 'styled-components';

const NoPosts = ({ text, noPosts }) => {
  return <>{noPosts && <Container>{text}</Container>}</>;
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.background.primary};
  color: ${({ theme }) => theme.font.secondary};
  padding: 0 60px;
  height: 60px;
  font-size: 17px;
  border-radius: 4px;
  box-sizing: border-box;
  transition: box-shadow 0.25s;
  border: ${({ theme }) => theme.border.secondary};
`;

export default NoPosts;
