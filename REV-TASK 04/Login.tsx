import React, { useState } from 'react';
import { signInWithGoogle } from '../firebase';
import { Button, Container, Typography, Box, Alert, CircularProgress } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

interface LoginProps {
  onLoginSuccess: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const user = await signInWithGoogle();
      onLoginSuccess(user);
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      setError(error.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        py: 8,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        position: 'relative',
        '&:before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(2, 33, 204, 0.1) 0%, rgba(0, 45, 90, 0.1) 100%)',
          zIndex: -1,
        }
      }}
    >
      <Box
        sx={{
          width: '100%',
          p: { xs: 3, md: 4 },
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: 3,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          color: 'rgba(0, 0, 0, 0.87)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            zIndex: -1,
          },
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: -80,
            left: -60,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(33, 150, 243, 0.05)',
            zIndex: -1,
          }
        }}
      >
        <Typography 
          component="h1" 
          variant="h4" 
          gutterBottom 
          sx={{ 
            color: 'rgba(0, 0, 0, 0.87)',
            fontWeight: 700,
            mb: 3,
            background: 'linear-gradient(45deg, #1976d2 0%, #004ba0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}
        >
          Resume Validator
        </Typography>
        
        <Typography 
          variant="body1" 
          paragraph 
          sx={{ 
            mb: 4,
            color: 'rgba(0, 0, 0, 0.87)',
            lineHeight: 1.7
          }}
        >
          Analyze your resume against job descriptions using AI to improve your job application success rate.
        </Typography>
        
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              width: '100%', 
              mb: 3,
              backgroundColor: 'rgba(211, 47, 47, 0.2)',
              color: 'rgba(0, 0, 0, 0.87)',
              '& .MuiAlert-icon': {
                color: 'rgba(0, 0, 0, 0.87)',
              }
            }}
          >
            {error}
          </Alert>
        )}
        
        <Button
          variant="contained"
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <GoogleIcon />}
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          sx={{
            background: 'linear-gradient(45deg, #4285F4 0%, #34A853 100%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #3367D6 0%, #2D9148 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
            },
            padding: '12px 24px',
            fontSize: '1rem',
            minWidth: '240px',
            borderRadius: '50px',
            textTransform: 'none',
            fontWeight: 500,
            letterSpacing: '0.5px',
            transition: 'all 0.3s ease',
            '& .MuiButton-startIcon': {
              marginRight: '10px',
            },
            '&.Mui-disabled': {
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'rgba(0, 0, 0, 0.5)',
            }
          }}
        >
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </Button>
        
        {isLoading && (
          <Typography 
            variant="body2" 
            sx={{ 
              mt: 2,
              color: 'rgba(255, 255, 255, 0.7)'
            }}
          >
            Opening Google sign-in popup...
          </Typography>
        )}
        
        <Box mt={4} textAlign="center">
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(0, 0, 0, 0.6)',
              fontSize: '0.875rem'
            }}
          >
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;