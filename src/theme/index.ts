import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6C63FF',
    },
    success: {
      main: '#10B981',
      light: '#ECFDF5',
      dark: '#059669',
    },
    error: {
      main: '#EF4444',
      light: '#FEF2F2',
      dark: '#DC2626',
    },
    background: {
      default: '#EDEEF4',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: '1px solid #E5E7EB',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#F8F9FC',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          width: 480,
          backgroundColor: '#FFFFFF',
        },
      },
    },
    MuiChip: {
      variants: [
        {
          props: { variant: 'priceUp' },
          style: {
            backgroundColor: '#ECFDF5',
            color: '#059669',
            fontWeight: 700,
            border: 'none',
          },
        },
        {
          props: { variant: 'priceDown' },
          style: {
            backgroundColor: '#FEF2F2',
            color: '#DC2626',
            fontWeight: 700,
            border: 'none',
          },
        },
      ],
    },
  },
});

export default theme;