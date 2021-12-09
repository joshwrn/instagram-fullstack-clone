import React, { useEffect, useState } from 'react';

import ImageLoader from '../reusable/ImageLoader';

import styled, { keyframes } from 'styled-components';

const StoriesItem = ({ seen, userId, displayName, avatar }) => {
  return (
    <ItemContainer>
      <ImageContainer>
        <ImageLoader
          width="66px"
          height="66px"
          borderRadius="100%"
          src="https://images.unsplash.com/photo-1523057530100-383d7fbc77a1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80"
        />
        <GradientBackground />
      </ImageContainer>
      <DisplayName>mia chapman</DisplayName>
    </ItemContainer>
  );
};

const StoriesBar = () => {
  return (
    <Bar>
      <StoriesItem />
      <StoriesItem />
      <StoriesItem />
      <StoriesItem />
      <StoriesItem />
      <StoriesItem />
      <StoriesItem />
    </Bar>
  );
};

const spin = keyframes`
   0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Bar = styled.div`
  display: flex;
  position: relative;
  justify-content: flex-start;
  align-items: center;
  width: 560px;
  height: 120px;
  padding: 0 25px;
  box-sizing: border-box;
  border-radius: 16px;
  border: ${({ theme }) => theme.border.primary};
  box-shadow: ${({ theme }) => theme.shadow.primary};
  margin-bottom: 32px;
  gap: 20px;
  overflow-x: scroll;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 70px;
  cursor: pointer;
  border-radius: 100%;
  overflow: hidden;
`;

const GradientBackground = styled.div`
  position: absolute;
  background: linear-gradient(
    45deg,
    #f09433 0%,
    #e6683c 25%,
    #dc2743 50%,
    #cc2366 75%,
    #bc1888 100%
  );
  width: 70px;
  height: 70px;
  border-radius: 100%;
  transition: box-shadow 0.3s ease-in-out;
`;

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  &:hover ${GradientBackground} {
    animation: 2s linear infinite ${spin};
    box-shadow: 0px 0px 20px 1px #bc1888a4;
  }
`;

const DisplayName = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.font.secondary};
`;

export default StoriesBar;
