import React from 'react';
import { Link } from 'react-router-dom';

import ImageLoader from '../../reusable/ImageLoader';

import styled from 'styled-components';

const HomeCardImage = ({ src, userID, postID }) => {
  return (
    <Link to={`/post/${userID}/${postID}`}>
      <ImageContainer>
        <ImageLoader src={src} cursor="pointer" />
      </ImageContainer>
    </Link>
  );
};

const ImageContainer = styled.div`
  width: 560px;
  height: 500px;
  @media only screen and (max-width: 850px) {
    width: 340px;
    height: 340px;
  }
`;

export default HomeCardImage;
