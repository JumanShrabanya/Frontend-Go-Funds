'use client';

import { createTheme } from '@mui/material/styles';
import { Inter } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563EB', // Trust Blue
      light: '#60A5FA',
      dark: '#1D4ED8',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#10B981', // Emerald Green
      light: '#34D399',
      dark: '#059669',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8FAFC', // Very light slate
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A', // Deep slate for high contrast
      secondary: '#475569',
    },
    divider: 'rgba(15, 23, 42, 0.08)',
    success: { main: '#10B981' },
    error: { main: '#EF4444' },
  },

  typography: {
    fontFamily: inter.style.fontFamily,
    h1: { fontWeight: 600, letterSpacing: '-0.5px', lineHeight: 1.15 },
    h2: { fontWeight: 600, letterSpacing: '-0.3px', lineHeight: 1.2 },
    h3: { fontWeight: 500, letterSpacing: '-0.2px', lineHeight: 1.3 },
    h4: { fontWeight: 500, letterSpacing: '-0.1px' },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
    subtitle1: { fontWeight: 400, letterSpacing: '0.01em' },
    subtitle2: { fontWeight: 400, letterSpacing: '0.01em' },
    body1: { fontWeight: 400, letterSpacing: '0.01em', lineHeight: 1.7 },
    body2: { fontWeight: 400, lineHeight: 1.65 },
    button: { fontWeight: 500, letterSpacing: '0.02em', textTransform: 'none' },
    caption: { fontWeight: 400, letterSpacing: '0.03em' },
  },

  shape: { borderRadius: 12 },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          fontSize: '0.95rem',
          transition: 'all 0.25s ease',
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)', transform: 'translateY(-1px)' },
        },
        contained: {
          background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
          color: '#FFFFFF',
          '&:hover': { background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' },
        },
        outlined: {
          borderColor: 'rgba(37, 99, 235, 0.3)',
          color: '#2563EB',
          '&:hover': {
            borderColor: '#2563EB',
            backgroundColor: 'rgba(37, 99, 235, 0.04)',
            boxShadow: 'none',
          },
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: '#FFFFFF',
            transition: 'all 0.2s ease',
            '& fieldset': { borderColor: 'rgba(15, 23, 42, 0.15)' },
            '&:hover fieldset': { borderColor: 'rgba(37, 99, 235, 0.4)' },
            '&.Mui-focused': {
              boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.1)',
              '& fieldset': { borderColor: '#2563EB', borderWidth: '1px' },
            },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: '#2563EB' },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(15, 23, 42, 0.04)',
        },
      },
    },

    MuiCssBaseline: {
      styleOverrides: `
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { background: #F8FAFC; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #F8FAFC; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
      `,
    },
  },
});

export default theme;
