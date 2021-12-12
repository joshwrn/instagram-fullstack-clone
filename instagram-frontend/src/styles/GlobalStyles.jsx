import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`

:root {
  --primary-font-color: rgb(0, 0, 0);
  --secondary-font-color: rgb(136, 136, 136);
  --nav-background-color: rgba(255, 255, 255, 0.733);
  --primary-transparent-color: rgba(255, 255, 255, 0.98);
  --user-menu-font-color: rgb(0, 0, 0);
  --save-color: rgb(73, 209, 107);
  --save-shadow-color: rgba(73, 209, 107, 0.336);
  --primary-background-color: rgb(255, 255, 255);
  --primary-border: 1px solid rgba(41, 41, 41, 0);
  --secondary-border: 1px solid rgb(206, 206, 206);
  --loading-gradient: linear-gradient(to right, #ffffff, #c2c2c2);
  --messages-sidebar-background: rgba(255, 255, 255, 0.87);
  --messages-bubble-background: #d3d3d3;
  --menu-hover-color: rgba(0, 0, 0, 0.1);
  --notification-type-color: rgb(75, 75, 75);
  --home-card-overlay: rgba(255, 255, 255, 0.85);
  --image-filter: initial;
}


* {
  margin: 0;
  padding: 0;

  -ms-overflow-style: none;
  scrollbar-width: none;
}

::-webkit-scrollbar {
  display: none;
}

img {
  user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

a {
  text-decoration: none;
  color: ${({ theme }) => theme.font.primary};
}

h1,
h2,
h3,
h4,
h5 {
  color: ${({ theme }) => theme.font.primary};
}

textarea:focus,
input:focus {
  outline: none;
}

button:focus {
  outline: 0;
}

html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  color: ${({ theme }) => theme.font.primary};
  background-color: ${({ theme }) => theme.background.primary};
  font-size: 16px;
}

* {
  font-family: Helvetica, sans-serif;
}

::selection {
  background-color: ${({ theme }) => theme.font.primary};
  color: ${({ theme }) => theme.background.primary};
}

@media screen and (max-width: 850px) {
  input[type='text'],
  input[type='number'],
  input[type='email'],
  input[type='tel'],
  input[type='password'] {
    font-size: 16px;
  }
}

.stop-scrolling {
  height: 100%;
  overflow: hidden;
}

.gradientLoad {
  animation: gradientMove 2s linear infinite;
  background: ${({ theme }) => theme.gradient.loading}; 
  background-size: 200%;
}

@keyframes gradientMove {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
`;

export default GlobalStyles;
