const baseTheme = {
  font: {
    secondary: 'rgb(136, 136, 136)',
  },
  shadow: {
    primary: '0px 0px 20px 1px rgba(0, 0, 0, 0.103)',
  },
};

export const darkTheme = {
  font: {
    primary: '#fff',
    secondary: baseTheme.font.secondary,
    subtle: '#c2c2c2',
  },
  background: {
    primary: '#000',
  },
  border: {
    primary: '1px solid rgb(41, 41, 41)',
    secondary: '1px solid rgb(41, 41, 41)',
    subtle: '1px solid rgb(49, 49, 49)',
  },
  gradient: {
    loading: 'linear-gradient(to right, #000000, #353535)',
  },
  message: {
    bubble: '#303030',
    sideBar: 'rgba(0, 0, 0, 0.87)',
  },
  notification: {
    type: 'rgb(221, 221, 221)',
  },
  menu: {
    hover: 'rgba(255, 255, 255, 0.1)',
  },
  shadow: {
    primary: baseTheme.shadow.primary,
  },
  overlay: {
    homeCard: 'rgba(0, 0, 0, 0.85)',
  },
};

export const lightTheme = {
  font: {
    primary: '#000',
    secondary: baseTheme.font.secondary,
    subtle: '#969696',
  },
  background: {
    primary: '#fff',
  },
  border: {
    primary: '1px solid transparent',
    secondary: '1px solid rgb(206, 206, 206)',
    subtle: '1px solid rgb(218, 218, 218)',
  },
  gradient: {
    loading: 'linear-gradient(to right, #ffffff, #c2c2c2)',
  },
  message: {
    bubble: '#d3d3d3',
    sideBar: 'rgba(255, 255, 255, 0.87)',
  },
  notification: {
    type: 'rgb(75, 75, 75)',
  },
  menu: {
    hover: 'rgba(0, 0, 0, 0.1)',
  },
  shadow: {
    primary: baseTheme.shadow.primary,
  },
  overlay: {
    homeCard: 'rgba(255, 255, 255, 0.85)',
  },
};
