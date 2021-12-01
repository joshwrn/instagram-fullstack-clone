const baseTheme = {
  font: {
    secondary: 'rgb(136, 136, 136)',
  },
};

export const darkTheme = {
  font: {
    primary: '#fff',
    secondary: baseTheme.font.secondary,
  },
  background: {
    primary: '#000',
  },
  border: {
    primary: '1px solid rgb(41, 41, 41)',
    secondary: '1px solid rgb(41, 41, 41)',
  },
  gradient: {
    loading: 'linear-gradient(to right, #000000, #353535)',
  },
  message: {
    bubble: '#303030',
    sideBar: 'rgba(0, 0, 0, 0.87)',
  },
};

export const lightTheme = {
  font: {
    primary: '#000',
    secondary: baseTheme.font.secondary,
  },
  background: {
    primary: '#fff',
  },
  border: {
    primary: '1px solid transparent',
    secondary: '1px solid rgb(206, 206, 206)',
  },
  gradient: {
    loading: 'linear-gradient(to right, #ffffff, #c2c2c2)',
  },
  message: {
    bubble: '#d3d3d3',
    sideBar: 'rgba(255, 255, 255, 0.87)',
  },
};
