import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { ThemeProvider, createTheme, CssBaseline, CircularProgress, Box, keyframes } from '@mui/material';
import Login from './components/Login';
import ResumeValidator from './components/ResumeValidator';

// Animation keyframes
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Polygon Mesh Styles
const polygonMeshStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  overflow: 'hidden',
  zIndex: 0,
  opacity: 0.4,
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(45deg, transparent 65%, rgba(63, 81, 181, 0.08) 65%),
      linear-gradient(-45deg, transparent 75%, rgba(63, 81, 181, 0.08) 75%),
      linear-gradient(45deg, rgba(63, 81, 181, 0.08) 25%, transparent 25%),
      radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 60%),
      radial-gradient(circle at 70% 70%, rgba(63, 81, 181, 0.1) 0%, transparent 60%)`,
    backgroundSize: '60px 60px',
    animation: 'moveMesh 30s linear infinite',
  },
  '@keyframes moveMesh': {
    '0%': { backgroundPosition: '0 0' },
    '100%': { backgroundPosition: '1000px 1000px' }
  }
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
      light: '#757de8',
      dark: '#002984',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
      contrastText: '#ffffff',
    },
    background: {
      default: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      paper: 'transparent',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.8)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01562em',
      background: 'linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.2,
      color: '#ffffff',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.3,
      color: '#ffffff',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.3,
      color: '#ffffff',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: 'rgba(255, 255, 255, 0.8)',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          boxShadow: '0 4px 14px rgba(63, 81, 181, 0.1)',
          backdropFilter: 'blur(8px)',
          background: 'rgba(255, 255, 255, 0.1)',
          color: '#3f51b5',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(63, 81, 181, 0.15)',
            background: 'rgba(255, 255, 255, 0.2)',
          },
        },
        contained: {
          '&:hover': {
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease-in-out',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'transparent',
          border: 'none',
          boxShadow: 'none',
          '&:hover': {
            background: 'transparent',
            transform: 'none',
          },
        },
      },
    },
  },
});

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = (user: User) => {
    setUser(user);
  };

  const handleLogout = () => {
    auth.signOut();
    setUser(null);
  };

  const BackgroundElements = () => (
    <>
      <Box 
        sx={{
          position: 'fixed',
          top: '10%',
          left: '5%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(63, 81, 181, 0.1) 0%, rgba(63, 81, 181, 0) 70%)',
          zIndex: 0,
          opacity: 0.8,
          filter: 'blur(4px)',
          animation: `${pulseAnimation} 8s ease-in-out infinite`,
        }}
      />
      <Box 
        sx={{
          position: 'fixed',
          bottom: '10%',
          right: '5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 0, 87, 0.1) 0%, rgba(245, 0, 87, 0) 70%)',
          zIndex: 0,
          opacity: 0.6,
          filter: 'blur(6px)',
          animation: `${pulseAnimation} 10s ease-in-out infinite 1s`,
        }}
      />
      <Box 
        sx={{
          position: 'fixed',
          top: '50%',
          right: '15%',
          width: '200px',
          height: '200px',
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          background: 'linear-gradient(45deg, rgba(63, 81, 181, 0.1), rgba(33, 150, 243, 0.08))',
          zIndex: 0,
          opacity: 0.7,
          filter: 'blur(3px)',
          animation: `${floatAnimation} 12s ease-in-out infinite`,
          transform: 'rotate(45deg)',
        }}
      />
    </>
  );

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box 
          sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 20% 20%, rgba(63, 81, 181, 0.1) 0%, transparent 40%)',
              zIndex: 0,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 80% 80%, rgba(245, 0, 87, 0.1) 0%, transparent 40%)',
              zIndex: 0,
            }
          }}
        >
          <Box sx={polygonMeshStyles} />
          <BackgroundElements />
          <Box position="relative" zIndex={1}>
            <Box 
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Box 
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #3f51b5, #2196f3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: `${pulseAnimation} 2s ease-in-out infinite`,
                  boxShadow: '0 10px 30px -10px rgba(63, 81, 181, 0.2)',
                }}
              >
                <Box 
                  component="span" 
                  sx={{ 
                    color: '#ffffff',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    textShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }}
                >
                  R
                </Box>
              </Box>
              <CircularProgress 
                size={24} 
                thickness={4}
                sx={{ 
                  color: '#3f51b5',
                  '& .MuiCircularProgress-circle': {
                    strokeLinecap: 'round',
                  },
                }} 
              />
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 20%, rgba(63, 81, 181, 0.1) 0%, transparent 40%)',
            zIndex: 0,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 80% 80%, rgba(245, 0, 87, 0.1) 0%, transparent 40%)',
            zIndex: 0,
          }
        }}
      >
        <Box sx={polygonMeshStyles} />
        <BackgroundElements />
        <Box 
          position="relative"
          zIndex={1}
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {user ? (
            <ResumeValidator user={user} onLogout={handleLogout} />
          ) : (
            <Login onLoginSuccess={handleLoginSuccess} />
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;