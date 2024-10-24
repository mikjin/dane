import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#006A6A',
      light: '#4B9696',
      dark: '#004040',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4A6363',
      light: '#778F8F',
      dark: '#1F3939',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#BA1A1A',
      light: '#FFB4AB',
      dark: '#93000A',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FAFDFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#191C1C',
      secondary: '#3F4948',
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.25rem',
      fontWeight: 400,
      letterSpacing: '-0.5px',
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 400,
      letterSpacing: '0',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
      letterSpacing: '0.15px',
    },
    body1: {
      fontSize: '1rem',
      letterSpacing: '0.5px',
    },
    body2: {
      fontSize: '0.875rem',
      letterSpacing: '0.25px',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '100px',
          padding: '10px 24px',
        },
        contained: {
          boxShadow: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '28px',
          boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
          },
        },
      },
    },
  },
});