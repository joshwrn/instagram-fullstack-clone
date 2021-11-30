import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
   0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Loader = styled.div`
  border: 3px solid #525252;
  border-top: 3px solid ${(props) => props.theme.font.secondary};
  border-radius: 50%;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  animation: ${spin} 2s linear infinite;
  align-self: center;
  justify-self: center;
`;

const LoadingIcon = ({
  size = 21,
  loading = false,
  isFetching = false,
  end = false,
}) => {
  let loader = null;

  if (!end) {
    if (loading || isFetching) {
      loader = <Loader size={size} />;
    }
  }

  return <>{loader}</>;
};

export default LoadingIcon;
