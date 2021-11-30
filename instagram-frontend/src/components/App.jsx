import React, { useState } from 'react';
import { HashRouter, Route } from 'react-router-dom';

import Nav from './Nav/Nav';
import Home from './Home/Home';
import Profile from './Profile/Profile';
import Post from './Post/Post';
import SignUp from './SignUp/SignUp';
import Login from './SignUp/Login';
import Settings from './Settings/Settings';
import Messages from './Messages/Messages';

import { AuthProvider } from '../contexts/AuthContext';

import '../styles/app.css';

import { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from '../styles/theme';

function App() {
  const [theme, setTheme] = useState('dark');

  return (
    <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
      <HashRouter>
        <AuthProvider>
          <div className="App">
            {/*//+ Nav */}
            <Nav setTheme={setTheme} theme={theme} />
            {/*//+ Home */}
            <Route exact path="/">
              <Home />
            </Route>
            {/*//+ Messages */}
            <Route exact path="/messages/:uid" component={Messages} />
            <Route exact path="/messages">
              <Messages />
            </Route>
            {/*//+ Sign up */}
            <Route exact path="/sign-up">
              <SignUp />
            </Route>
            {/*//+ Login */}
            <Route exact path="/login">
              <Login />
            </Route>
            {/*//+ Profile */}
            <Route exact path="/profile/:uid" component={Profile} />
            {/*//+ post */}
            <Route exact path="/post/:uid/:postid" component={Post} />
            {/*//+ settings */}
            <Route exact path="/settings">
              <Settings />
            </Route>
          </div>
        </AuthProvider>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
