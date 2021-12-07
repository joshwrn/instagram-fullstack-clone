import React from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';

import styled from 'styled-components';

const LoginButton = () => {
  const { currentUser } = useAuth();

  return (
    <div>
      {!currentUser && (
        <Container>
          <Link to="/sign-up">
            <SignUp>Sign Up</SignUp>
          </Link>
          <Link to="/login">
            <Login>Login</Login>
          </Link>
        </Container>
      )}
    </div>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  color: ${({ theme }) => theme.font.secondary};
`;

const Button = styled.button`
  padding: 0 2em;
  height: 2.25em;
  width: 13em;
  font-size: 16px;
  border-radius: 16px;
  cursor: pointer;
  box-sizing: border-box;
  font-weight: bold;
  transition: box-shadow 0.25s, transform 0.25s;
  &:hover {
    box-shadow: 0px 0px 20px 1px rgba(0, 0, 0, 0.2);
  }
`;

const SignUp = styled(Button)`
  background-color: ${({ theme }) => theme.font.primary};
  color: ${({ theme }) => theme.background.primary};
  border: ${({ theme }) => theme.border.primary};
`;

const Login = styled(Button)`
  border: none;
  box-shadow: 0px 0px 20px 1px rgba(0, 0, 0, 0.1);
  background-color: ${({ theme }) => theme.background.primary};
  color: ${({ theme }) => theme.font.primary};
  position: relative;
  z-index: 10;
  border: ${({ theme }) => theme.border.primary};
`;

export default LoginButton;
