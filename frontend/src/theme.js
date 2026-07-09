import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1B4B43',      // deep pine green — calm, focused, not generic SaaS blue
      light: '#3A6B60',
      dark: '#0D2E28',
      contrastText: '#F7F5F0',
    },
    secondary: {
      main: '#D9772A',      // warm amber-orange accent for actions/highlights
      light: '#E89A5C',
      dark: '#B3591A',
    },
    background: {
      default: '#F7F5F0',   // warm off-white, not stark white
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#5C5C5C',
    },
    success: { main: '#2E7D32' },
    warning: { main: '#D9772A' },
    error: { main: '#C0392B' },
    divider: '#E5E1D8',
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h4: { fontWeight: 700, letterSpacing: '-0.01em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          paddingLeft: 20,
          paddingRight: 20,
        },
        containedPrimary: {
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #E5E1D8',
          boxShadow: 'none',
          transition: 'border-color 0.15s ease, transform 0.1s ease',
          '&:hover': {
            borderColor: '#1B4B43',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.72rem',
        },
      },
    },
  },
});

export default theme;