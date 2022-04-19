import React from 'react';
import { useHistory } from 'react-router';

import FollowButton from '../../reusable/FollowButton';

import { useAuth } from '../../../contexts/AuthContext';

import { IoCloseOutline } from 'react-icons/io5';
import styled from 'styled-components';

const HomeCardOverlay = ({ getModal, type, userID, post }) => {
  const { currentUser } = useAuth();
  let history = useHistory();

  const copyToClipboard = (content) => {
    const el = document.createElement('textarea');
    el.value = content;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  const handleShare = () => {
    copyToClipboard(`${window.location.href}post/${userID}/${post.id}`);
    getModal();
  };

  const openLink = (linkType) => {
    history.push(`/${linkType}`);
  };

  let button;

  if (type === 'share') {
    button = (
      <Share>
        <Input
          value={`${window.location.href}post/${userID}/${post.id}`}
          readOnly
        />
        <StyledFollowButton onClick={handleShare}>Copy Link</StyledFollowButton>
      </Share>
    );
  }

  if (type === 'follow') {
    if (!currentUser) {
      button = (
        <StyledFollowButton
          onClick={() => {
            openLink('sign-up');
          }}
        >
          Login
        </StyledFollowButton>
      );
    }

    if (currentUser) {
      button = <StyledFollowButton as={FollowButton} currentProfile={userID} />;
    }
  }

  return (
    <Container>
      <Header>
        <Close onClick={getModal} />
      </Header>
      <Main>{button}</Main>
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  z-index: 50;
  background-color: ${({ theme }) => theme.overlay.homeCard};
  animation: fade 0.25s forwards;
`;

const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding: 11px 19px;
  box-sizing: border-box;
`;

const Close = styled(IoCloseOutline)`
  align-self: flex-end;
  font-size: 34px;
  cursor: pointer;
  color: ${({ theme }) => theme.font.primary};
`;

const Main = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
`;

const StyledFollowButton = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.font.primary};
  height: 43px;
  font-size: 16px;
  width: 200px;
  border-radius: 19px;
  cursor: pointer;
  box-sizing: border-box;
  font-weight: bold;
  transition: box-shadow 0.25s, transform 0.25s;
  border: 1px solid ${({ theme }) => theme.font.primary};

  &:hover {
    color: ${({ theme }) => theme.background.primary};
    background-color: ${({ theme }) => theme.font.primary};
    box-shadow: 0px 5px 20px 1px rgba(0, 0, 0, 0.25);
    transform: translateY(-2px);
  }
`;

const Share = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const Input = styled.input`
  padding: 0em 16px 0 16px;
  background: rgba(32, 32, 32, 0);
  border: 1px solid ${({ theme }) => theme.font.primary};
  border-radius: 19px;
  height: 28px;
  text-align: center;
  transition: width 0.5s;
  box-sizing: border-box;
  width: 200px;
  color: ${({ theme }) => theme.font.primary};
`;

export default HomeCardOverlay;
