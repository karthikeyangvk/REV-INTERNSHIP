import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { extractTextFromPdf, analyzeResume } from '../utils/gemini';
import { 
  Button, 
  Container, 
  Typography, 
  Box, 
  TextField, 
  CircularProgress, 
  Paper, 
  Divider, 
  Alert, 
  Avatar, 
  Chip, 
  Fade, 
  Slide, 
  Grow, 
  Zoom,
  Tooltip,
  IconButton,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { 
  Upload as UploadIcon, 
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon, 
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Lightbulb as LightbulbIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Star as StarIcon,
  AutoAwesome as AutoAwesomeIcon,
  Close as CloseIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { User } from 'firebase/auth';
import { keyframes } from '@emotion/react';

// Animation keyframes
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const shine = keyframes`
  to {
    background-position: 200% center;
  }
`;

// Add a debug mode constant
const DEBUG_MODE = true;

interface ResumeValidatorProps {
  user: User;
  onLogout: () => void;
}

const ResumeValidator: React.FC<ResumeValidatorProps> = ({ user, onLogout }) => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [error, setError] = useState('');
  const [showTips, setShowTips] = useState(true);
  const [enableAdvancedAnalysis, setEnableAdvancedAnalysis] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
      setError('');
      setAnalysisResult('');
    },
  });

  // Floating elements data
  const floatingElements = [
    { top: '15%', left: '5%', size: 30, delay: '0s', color: 'rgba(63, 81, 181, 0.6)' },
    { top: '25%', right: '8%', size: 40, delay: '0.5s', color: 'rgba(33, 150, 243, 0.7)' },
    { bottom: '20%', left: '7%', size: 25, delay: '1s', color: 'rgba(233, 30, 99, 0.6)' },
    { bottom: '30%', right: '10%', size: 35, delay: '1.5s', color: 'rgba(76, 175, 80, 0.6)' },
  ];

  const debugLog = (...args: any[]) => {
    if (DEBUG_MODE) {
      console.log('[DEBUG]', ...args);
    }
  };

  const handleAnalyze = async () => {
    debugLog('Starting analysis...');
    
    if (!file) {
      const msg = 'Please upload a resume first';
      debugLog(msg);
      setError(msg);
      return;
    }
    
    if (!jobDescription.trim()) {
      const msg = 'Please enter a job description';
      debugLog(msg);
      setError(msg);
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setAnalysisResult('');
    
    try {
      debugLog('Step 1/4: Starting PDF text extraction...');
      const resumeText = await extractTextFromPdf(file);
      debugLog('Step 1/4: Text extraction complete. Length:', resumeText.length);
      
      if (!resumeText || resumeText.trim().length === 0) {
        throw new Error('Extracted text is empty');
      }
      
      // Show preview of extracted text in debug mode
      if (DEBUG_MODE) {
        const preview = resumeText.substring(0, 200) + (resumeText.length > 200 ? '...' : '');
        debugLog('Extracted text preview:', preview);
      }

      debugLog('Step 2/4: Sending to Gemini API...');
      // Simulate API call delay for better UX
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = await analyzeResume(resumeText, jobDescription);
      debugLog('Step 3/4: Analysis complete');
      
      setAnalysisResult(result);
      debugLog('Step 4/4: Results displayed');
      
    } catch (err: any) {
      console.error('Error in handleAnalyze:', {
        error: err,
        message: err.message,
        stack: err.stack,
        name: err.name,
        response: err.response
      });
      
      let errorMessage = 'Failed to analyze resume. ';
      
      if (err.message.includes('network')) {
        errorMessage += 'Network error. Please check your internet connection.';
      } else if (err.message.includes('API key') || err.message.includes('authentication') || err.message.includes('API_KEY')) {
        errorMessage = 'Authentication error. Please check if your Gemini API key is correctly set in the .env file.';
      } else if (err.message.includes('Extracted text is empty') || err.message.includes('no extractable text')) {
        errorMessage = 'The PDF appears to be empty, corrupted, or contains no extractable text. Please try a different file.';
      } else if (err.message.includes('Invalid PDF') || err.message.includes('corrupted')) {
        errorMessage = 'The file is not a valid PDF or is corrupted. Please try a different file.';
      } else if (err.message.includes('password')) {
        errorMessage = 'Password-protected PDFs are not supported. Please remove the password and try again.';
      } else if (err.message.includes('file size')) {
        errorMessage = 'The file is too large. Maximum size is 10MB.';
      } else if (err.message.includes('Gemini API Error')) {
        errorMessage = `Error from Gemini API: ${err.message.replace('Gemini API Error: ', '')}`;
      } else {
        errorMessage += `Error: ${err.message || 'Unknown error occurred'}`;
      }
      
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Shimmer effect component
  const Shimmer = ({ width = '100%', height = '16px', mb = 1 }) => (
    <Box 
      sx={{ 
        width, 
        height, 
        mb,
        background: 'linear-gradient(90deg, rgba(0,0,0,0.05) 25%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.05) 75%)',
        backgroundSize: '200% 100%',
        animation: `${shine} 1.5s infinite linear`,
        borderRadius: 1
      }} 
    />
  );

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        mt: 4, 
        mb: 6, 
        position: 'relative',
        backgroundColor: 'transparent',
        '& .MuiPaper-root': {
          backgroundColor: 'rgba(255, 255, 255, 0.05) !important',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'rgba(0, 0, 0, 0.87)',
          '&:hover': {
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
            backgroundColor: 'rgba(255, 255, 255, 0.08) !important'
          }
        },
        '& .MuiTypography-root': {
          color: 'rgba(0, 0, 0, 0.87)'
        }  
      }}
    >
      {/* Background Dots */}
      <Box className="background-dots" />
      
      {/* Floating Elements */}
      {floatingElements.map((el, index) => (
        <Box
          key={index}
          sx={{
            position: 'fixed',
            top: el.top,
            left: el.left,
            right: el.right,
            width: el.size,
            height: el.size,
            borderRadius: '50%',
            background: el.color,
            zIndex: -1,
            animation: `${float} 6s ease-in-out infinite ${el.delay}`,
            filter: 'blur(1px)',
            opacity: 0.7,
          }}
        />
      ))}

      {/* Header with animation */}
      <Slide direction="down" in={true} timeout={500}>
        <Box 
          sx={{
            background: 'linear-gradient(135deg, rgba(63, 81, 181, 0.8) 0%, rgba(33, 150, 243, 0.8) 100%)',
            borderRadius: 3,
            p: 3,
            mb: 4,
            color: 'rgba(0, 0, 0, 0.87)',
            boxShadow: '0 8px 32px rgba(63, 81, 181, 0.2)',
            position: 'relative',
            overflow: 'hidden',
            backdropFilter: 'blur(10px)',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
            },
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -80,
              left: -60,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          <Box position="relative" zIndex={1}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box display="flex" alignItems="center">
                <AutoAwesomeIcon sx={{ 
                  fontSize: 32, 
                  mr: 1.5,
                  animation: `${pulse} 3s infinite`,
                }} />
                <Typography variant="h4" component="h1" sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #f5f5f5 30%, #e0e0e0 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)',
                  textShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                  Resume Validator Pro
                </Typography>
              </Box>
              <Tooltip title="Sign Out" arrow>
                <IconButton 
                  onClick={onLogout} 
                  className="animated-button"
                  sx={{ 
                    color: 'rgba(0, 0, 0, 0.87)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Box>
            
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar 
                src={user.photoURL || undefined} 
                sx={{ 
                  width: 56, 
                  height: 56, 
                  mr: 2,
                  border: '3px solid white',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05) rotate(5deg)',
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                  }
                }}
              >
                {!user.photoURL && <PersonIcon fontSize="large" />}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  display: 'flex', 
                  alignItems: 'center',
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}>
                  Welcome back, {user.displayName || 'Valued User'}!
                  <StarIcon sx={{ 
                    ml: 1, 
                    color: '#f57c00', 
                    fontSize: '1.2rem',
                    animation: `${pulse} 2s infinite`,
                  }} />
                </Typography>
                <Typography variant="body2" sx={{ 
                  opacity: 0.9, 
                  display: 'flex', 
                  alignItems: 'center',
                  textShadow: '0 1px 1px rgba(0,0,0,0.1)'
                }}>
                  <InfoIcon fontSize="small" sx={{ mr: 0.5 }} />
                  Let's optimize your resume for your dream job!
                </Typography>
              </Box>
            </Box>
            
            <Typography variant="body1" sx={{ 
              opacity: 0.95, 
              maxWidth: '80%', 
              lineHeight: 1.7,
              textShadow: '0 1px 1px rgba(0,0,0,0.1)'
            }}>
              Upload your resume (PDF) and paste the job description below to receive AI-powered feedback on how well your resume aligns with the job requirements. 
              Our advanced analysis will help you stand out from the competition!
            </Typography>
            
            <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
              <Chip 
                icon={<CheckCircleIcon fontSize="small" />} 
                label="AI-Powered Analysis" 
                size="small" 
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                  color: 'rgba(0, 0, 0, 0.87)',
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }
                }} 
              />
              <Chip 
                icon={<CheckCircleIcon fontSize="small" />} 
                label="Instant Feedback" 
                size="small" 
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                  color: 'rgba(0, 0, 0, 0.87)',
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }
                }} 
              />
              <Chip 
                icon={<CheckCircleIcon fontSize="small" />} 
                label="Actionable Insights" 
                size="small" 
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                  color: 'rgba(0, 0, 0, 0.87)',
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }
                }} 
              />
            </Box>
          </Box>
        </Box>
      </Slide>

      {/* Tips Section */}
      {showTips && (
        <Fade in={true} timeout={800}>
          <Box 
            className="glass-card"
            sx={{ 
              p: 3, 
              mb: 4,
              position: 'relative',
              overflow: 'hidden',
              borderLeft: '4px solid',
              borderColor: 'primary.main',
              '&:before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: 100,
                height: 100,
                background: 'linear-gradient(45deg, rgba(63, 81, 181, 0.1) 0%, rgba(33, 150, 243, 0.1) 100%)',
                borderRadius: '0 0 0 100%',
                zIndex: 0,
              }
            }}
          >
            <Box position="relative" zIndex={1}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <LightbulbIcon color="primary" sx={{ mr: 1 }} />
                    Pro Tip
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    For best results, make sure your resume includes relevant keywords from the job description 
                    and follows a clean, professional format with clear section headers.
                  </Typography>
                </Box>
                <IconButton 
                  size="small" 
                  onClick={() => setShowTips(false)}
                  sx={{ 
                    ml: 1,
                    alignSelf: 'flex-start',
                    color: 'rgba(0, 0, 0, 0.6)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Fade>
      )}

      {/* Upload Resume Section */}
      <Fade in={true} timeout={800}>
        <Paper 
          className="glass-card"
          sx={{ 
            p: 4, 
            mb: 4,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box 
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 120,
              height: 120,
              background: 'linear-gradient(45deg, rgba(63, 81, 181, 0.1) 0%, rgba(33, 150, 243, 0.1) 100%)',
              borderRadius: '0 0 0 100%',
              zIndex: 0,
            }}
          />
          
          <Box position="relative" zIndex={1}>
            <Box display="flex" alignItems="center" mb={3}>
              <Box 
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #3f51b5 0%, #2196f3 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(0, 0, 0, 0.87)',
                  fontWeight: 'bold',
                  mr: 2,
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(63, 81, 181, 0.3)',
                  animation: `${pulse} 2s infinite` 
                }}
              >
                1
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
                Upload Your Resume
              </Typography>
            </Box>
            
            <Box
              {...getRootProps()}
              sx={{
                border: '2px dashed',
                borderColor: isDragActive ? 'primary.main' : 'rgba(255, 255, 255, 0.3)',
                borderRadius: 2,
                p: { xs: 3, md: 5 },
                textAlign: 'center',
                backgroundColor: isDragActive ? 'rgba(63, 81, 181, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'rgba(63, 81, 181, 0.1)',
                  '& .upload-icon': {
                    transform: 'scale(1.05)',
                  },
                },
              }}
            >
              <input {...getInputProps()} />
              <Box 
                className="upload-icon"
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(63, 81, 181, 0.1)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                <UploadIcon fontSize="large" color="primary" sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'white' }}>
                {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume here'}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
                or <span style={{ color: '#90caf9', fontWeight: 600 }}>browse files</span>
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', display: 'block' }}>
                Supported format: PDF (max 10MB)
              </Typography>
            </Box>
            
            {file && (
              <Grow in={true} timeout={500}>
                <Box 
                  mt={3} 
                  sx={{
                    p: 2,
                    backgroundColor: 'rgba(63, 81, 181, 0.15)',
                    borderRadius: 2,
                    borderLeft: '4px solid',
                    borderColor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    animation: `${pulse} 2s infinite`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    },
                    transition: 'all 0.3s ease-in-out'
                  }}
                >
                  <CheckCircleIcon color="primary" sx={{ mr: 1.5, fontSize: 30 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, color: 'white' }}>
                      {file.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', display: 'flex', alignItems: 'center' }}>
                      {formatFileSize(file.size)} • Ready for analysis
                    </Typography>
                  </Box>
                  <Tooltip title="Remove file" arrow>
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      sx={{ 
                        ml: 1,
                        color: 'rgba(0, 0, 0, 0.6)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        }
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grow>
            )}
            
            <Box mt={3} display="flex" alignItems="center" flexWrap="wrap" gap={1.5}>
              <Box display="flex" alignItems="center" sx={{ mr: 2 }}>
                <LightbulbIcon color="primary" fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  <strong>Tip:</strong> Use a PDF with clear section headers
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <InfoIcon color="primary" fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Your files are processed securely and never stored
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Fade>

      {/* Job Description Section */}
      <Fade in={true} timeout={1000}>
        <Paper 
          className="glass-card"
          sx={{ 
            p: 4, 
            mb: 4,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box 
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 100,
              height: 100,
              background: 'radial-gradient(circle, rgba(33, 150, 243, 0.1) 0%, transparent 70%)',
              borderRadius: '100% 0 0 0',
              zIndex: 0,
            }}
          />
          
          <Box position="relative" zIndex={1}>
            <Box display="flex" alignItems="center" mb={3}>
              <Box 
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #f50057 0%, #ff4081 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(0, 0, 0, 0.87)',
                  fontWeight: 'bold',
                  mr: 2,
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(245, 0, 87, 0.3)',
                  animation: `${pulse} 2s infinite 0.5s` 
                }}
              >
                2
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'secondary.main' }}>
                Job Description
              </Typography>
            </Box>
            
            <TextField
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value);
                setAnalysisResult('');
              }}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  color: 'rgba(0, 0, 0, 0.87)',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(0, 0, 0, 0.6)',
                },
                '& .MuiInputBase-input': {
                  color: 'rgba(0, 0, 0, 0.87)',
                  '&::placeholder': {
                    color: 'rgba(0, 0, 0, 0.8)',
                    opacity: 1,
                  },
                },
              }}
            />
            
            <Box mt={2} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={enableAdvancedAnalysis}
                    onChange={(e) => setEnableAdvancedAnalysis(e.target.checked)}
                    color="primary"
                    sx={{
                      '&.Mui-checked': {
                        color: 'rgba(0, 0, 0, 0.87)',
                      },
                      '& .MuiSvgIcon-root': {
                        fontSize: 24,
                      }
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                      Enable Advanced Analysis
                      <Tooltip 
                        title="Uses more advanced AI analysis for deeper insights (may take longer to process)" 
                        arrow
                        placement="top"
                      >
                        <InfoIcon fontSize="small" sx={{ ml: 0.5, opacity: 0.7 }} />
                      </Tooltip>
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(0, 0, 0, 0.7)', display: 'block' }}>
                      Get more detailed feedback and suggestions
                    </Typography>
                  </Box>
                }
                sx={{ 
                  m: 0,
                  '& .MuiFormControlLabel-label': {
                    width: '100%',
                  }
                }}
              />
              
              <Tooltip 
                title={!file || !jobDescription.trim() ? 'Please upload a resume and enter a job description' : ''} 
                arrow
                placement="top"
              >
                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !file || !jobDescription.trim()}
                    className="animated-button"
                    startIcon={
                      isAnalyzing ? (
                        <CircularProgress 
                          size={20} 
                          color="inherit" 
                          sx={{ 
                            animation: `${rotate} 1s linear infinite`,
                            marginRight: 1 
                          }} 
                        />
                      ) : (
                        <AutoAwesomeIcon />
                      )
                    }
                    sx={{
                      py: 1.5,
                      px: 4,
                      borderRadius: '50px',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1rem',
                      boxShadow: '0 4px 14px rgba(63, 81, 181, 0.3)',
                      background: 'linear-gradient(45deg, #3f51b5 0%, #2196f3 100%)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(63, 81, 181, 0.4)',
                        transform: 'translateY(-2px)',
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                      },
                      '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(45deg, #2196f3 0%, #3f51b5 100%)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                      },
                      '&:hover:before': {
                        opacity: 1,
                      },
                      '& .MuiButton-label': {
                        position: 'relative',
                        zIndex: 1,
                      },
                      '&.Mui-disabled': {
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'rgba(0, 0, 0, 0.8)',
                        boxShadow: 'none',
                      }
                    }}
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
                  </Button>
                </Box>
              </Tooltip>
            </Box>
          </Box>
        </Paper>
      </Fade>

      {/* Loading State */}
      {isAnalyzing && (
        <Fade in={isAnalyzing} timeout={500}>
          <Box 
            className="glass-card"
            sx={{ 
              p: 4, 
              mb: 4,
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              animation: `${pulse} 2s infinite`,
            }}
          >
            <Box 
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: 'rgba(63, 81, 181, 0.1)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
              }}
            >
              <CircularProgress 
                size={40} 
                thickness={4} 
                sx={{ 
                  color: 'rgba(0, 0, 0, 0.87)',
                  animation: `${rotate} 1.5s linear infinite`,
                }} 
              />
            </Box>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Analyzing Your Resume
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(0, 0, 0, 0.7)', mb: 3 }}>
              This may take a moment. Please don't close this page.
            </Typography>
            
            {/* Shimmer Loading Effect */}
            <Box sx={{ maxWidth: 500, margin: '0 auto', textAlign: 'left' }}>
              <Shimmer width="70%" height="20px" mb={2} />
              <Shimmer width="90%" height="16px" mb={1} />
              <Shimmer width="85%" height="16px" mb={1} />
              <Shimmer width="80%" height="16px" mb={3} />
              <Shimmer width="65%" height="20px" mb={2} />
              <Shimmer width="95%" height="16px" mb={1} />
              <Shimmer width="88%" height="16px" mb={1} />
            </Box>
          </Box>
        </Fade>
      )}

      {/* Error State */}
      {/* Error State */}
{error && (
  <Fade in={!!error} timeout={500}>
    <Box mb={4}>
      <Alert 
        severity="error" 
        sx={{ 
          mb: 2,
          backgroundColor: 'rgba(211, 47, 47, 0.2)',
          color: 'rgba(0, 0, 0, 0.87)',
          '& .MuiAlert-icon': {
            color: 'rgba(0, 0, 0, 0.87)',
          },
          '& .MuiAlert-message': {
            width: '100%',
          }
        }}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => setError('')}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
          Oops! Something went wrong
        </Typography>
        <Typography variant="body2">
          {error}
        </Typography>
        {DEBUG_MODE && (
          <Box mt={2} p={2} sx={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            borderRadius: 1,
          }}>
            <Typography variant="caption" sx={{ color: 'rgba(0, 0, 0, 0.7)', display: 'block', mb: 1 }}>
              Debug Info (visible in development only):
            </Typography>
            <Box 
              component="pre" 
              sx={{ 
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                m: 0,
                p: 1.5,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                borderRadius: 1,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                maxHeight: 150,
                overflow: 'auto',
              }}
            >
              {JSON.stringify({
                fileName: file?.name,
                fileSize: file ? `${(file.size / 1024).toFixed(2)} KB` : 'No file',
                jobDescLength: jobDescription.length,
                timestamp: new Date().toISOString(),
              }, null, 2)}
            </Box>
          </Box>
        )}
      </Alert>
    </Box>
  </Fade>
)}

{/* Analysis Result Section */}
{analysisResult && (
  <Fade in={!!analysisResult} timeout={800}>
    <Paper 
      className="glass-card"
      sx={{ 
        p: { xs: 3, md: 4 },
        mt: 4,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box position="relative" zIndex={1}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center' }}>
          <AutoAwesomeIcon sx={{ mr: 1.5, color: 'primary.main' }} />
          Analysis Results
        </Typography>
        <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        <Box sx={{ whiteSpace: 'pre-line' }}>
          {analysisResult.split('\n').map((line, i) => (
            <Typography key={i} paragraph sx={{ mb: line.trim() ? 2 : 0, color: 'rgba(0, 0, 0, 0.7)' }}>
              {line || <br />}
            </Typography>
          ))}
        </Box>
        
        <Box mt={4} pt={3} borderTop="1px solid rgba(255, 255, 255, 0.1)">
          <Button
            variant="outlined"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={() => {
              const element = document.createElement('a');
              const file = new Blob([analysisResult], { type: 'text/plain' });
              element.href = URL.createObjectURL(file);
              element.download = 'resume-analysis.txt';
              document.body.appendChild(element);
              element.click();
              document.body.removeChild(element);
            }}
            sx={{
              borderRadius: '50px',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1,
              color: 'rgba(0, 0, 0, 0.87)',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(63, 81, 181, 0.2)',
                borderColor: 'rgba(0, 0, 0, 0.8)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Download Analysis
          </Button>
        </Box>
      </Box>
    </Paper>
  </Fade>
)}
</Container>
  );
};

export default ResumeValidator;