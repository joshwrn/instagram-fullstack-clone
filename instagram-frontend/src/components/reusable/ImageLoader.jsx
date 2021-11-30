import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const gradientMove = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
  `;

const LoadingDiv = styled.div`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  position: ${(props) => props.position};
  z-index: ${(props) => props.zIndex};
  background: ${(props) => props.theme.gradient.loading};
  background-size: 200%;
  animation: 2s linear infinite
    ${(props) => (props.isLoading ? gradientMove : 'none')};
  border-radius: ${(props) => props.borderRadius};
  box-shadow: ${(props) => props.shadow};
  transform: ${(props) => props.transform};
  margin: ${(props) => props.margin};
`;

const Image = styled(LoadingDiv).attrs({
  as: 'img',
})`
  object-fit: cover;
  object-position: center;
  opacity: ${(props) => (props.isLoading ? '0' : '1')};
  cursor: ${(props) => props.cursor};
  transition: opacity ${(props) => props.transition}s;
`;

const ImageLoader = ({
  src,
  type = 'image',
  position = 'relative',
  width = '100%',
  height = '100%',
  transition = 0.7,
  cursor = 'pointer',
  borderRadius = '0',
  shadow = 'none',
  zIndex = '1',
  transform = 'initial',
  margin = 'none',
}) => {
  const [loading, setLoading] = useState(true);

  const handleLoad = () => {
    setLoading(false);
  };

  return (
    <>
      <LoadingDiv
        isLoading={loading}
        width={width}
        height={height}
        position={position}
        zIndex={zIndex}
        borderRadius={borderRadius}
        shadow={shadow}
        transform={transform}
        margin={margin}
      >
        {type === 'image' && (
          <Image
            isLoading={loading}
            onLoad={handleLoad}
            src={src}
            cursor={cursor}
            transition={transition}
            width={width}
            height={height}
            position={position}
            zIndex={zIndex}
            borderRadius={borderRadius}
            shadow={shadow}
            transform={transform}
            margin={margin}
          />
        )}
      </LoadingDiv>
    </>
  );
};

export default ImageLoader;
