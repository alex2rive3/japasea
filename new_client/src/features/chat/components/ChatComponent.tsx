import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  Avatar,
  Divider,
  InputAdornment,
  Chip
} from '@mui/material';
import { 
  Send, 
  Person, 
  SmartToy, 
  History
} from '@mui/icons-material';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../../auth/hooks/useAuth';
import type { ChatMessage } from '../types';

export const ChatComponent: React.FC = () => {
  const { user } = useAuth();
  const { 
    messages,
    loading,
    isTyping,
    sendQuickMessage
  } = useChat();
  
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, isTyping]);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior });
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const messageContent = inputValue.trim();
    setInputValue('');
    
    try {
      await sendQuickMessage(messageContent);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  if (!user) {
    return (
      <Box sx={{ 
        borderRadius: 2, 
        overflow: 'hidden', 
        height: '100%',
        width: '100%',
        bgcolor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #e9ecef',
        textAlign: 'center'
      }}>
        <SmartToy sx={{ fontSize: 64, color: '#6c757d', mb: 2 }} />
        <Typography variant="h6" sx={{ color: '#2c3e50' }} gutterBottom>
          Asistente de Viajes IA
        </Typography>
        <Typography variant="body2" sx={{ color: '#6c757d' }}>
          Inicia sesión para comenzar a chatear con nuestro asistente
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      borderRadius: 2, 
      overflow: 'hidden', 
      height: '100%',
      width: '100%',
      bgcolor: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid #e9ecef'
    }}>
      <Box sx={{ 
        bgcolor: '#f8f9fa', 
        color: '#2c3e50', 
        p: 3, 
        textAlign: 'left',
        borderBottom: '1px solid #e9ecef',
        flexShrink: 0
      }}>
        <Typography variant="h5" component="h2" sx={{ 
          fontWeight: 600,
          mb: 1,
          color: '#2c3e50'
        }}>
          Japasea AI
        </Typography>
        <Typography variant="body2" sx={{ 
          color: '#6c757d',
          fontSize: '0.875rem'
        }}>
          Tu asistente de viajes para Encarnación
        </Typography>
        {user && (
          <Chip
            icon={<History />}
            label="Historial guardado"
            size="small"
            sx={{ mt: 1 }}
            color="primary"
            variant="outlined"
          />
        )}
      </Box>
      
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden',
        minHeight: 0
      }}>
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto',
          p: 2,
          maxWidth: '100%',
          bgcolor: '#ffffff',
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f8f9fa',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#dee2e6',
            borderRadius: '10px',
            '&:hover': {
              background: '#adb5bd',
            },
          },
          scrollbarWidth: 'thin',
          scrollbarColor: '#dee2e6 #f8f9fa',
        }} ref={messagesContainerRef}>
          <List sx={{ 
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden'
          }}>
            {messages.length === 0 && !loading && (
              <ListItem sx={{ 
                alignItems: 'flex-start', 
                py: 2, 
                flexDirection: 'column',
                width: '100%'
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  width: '100%',
                  justifyContent: 'flex-start'
                }}>
                  <Avatar 
                    sx={{ 
                      mr: 2, 
                      bgcolor: '#17a2b8',
                      width: 36,
                      height: 36,
                      flexShrink: 0
                    }}
                  >
                    <SmartToy sx={{ fontSize: 20 }} />
                  </Avatar>
                  <Box sx={{ 
                    flex: 1, 
                    minWidth: 0,
                    maxWidth: 'calc(100% - 52px)',
                    overflow: 'hidden'
                  }}>
                    <Box
                      sx={{
                        bgcolor: '#f8f9fa',
                        color: '#495057',
                        p: 2,
                        borderRadius: '20px 20px 20px 4px',
                        display: 'inline-block',
                        maxWidth: '100%',
                        wordBreak: 'break-word',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        border: '1px solid #e9ecef'
                      }}
                    >
                      <Typography variant="body2" sx={{ 
                        lineHeight: 1.4,
                        fontSize: '0.95rem'
                      }}>
                        ¡Hola! Soy tu asistente de viajes para Encarnación. ¿En qué puedo ayudarte hoy?
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </ListItem>
            )}

            {messages.map((message: ChatMessage) => (
              <ListItem key={message.id} sx={{ 
                alignItems: 'flex-start', 
                py: 2, 
                flexDirection: 'column',
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden',
                boxSizing: 'border-box',
                border: 'none'
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  width: '100%',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
                }}>
                  {message.role === 'assistant' && (
                    <Avatar 
                      sx={{ 
                        mr: 2, 
                        bgcolor: '#17a2b8',
                        width: 36,
                        height: 36,
                        flexShrink: 0
                      }}
                    >
                      <SmartToy sx={{ fontSize: 20 }} />
                    </Avatar>
                  )}
                  <Box sx={{ 
                    flex: message.role === 'user' ? '0 1 auto' : 1, 
                    minWidth: 0,
                    maxWidth: message.role === 'user' ? '80%' : 'calc(100% - 52px)',
                    overflow: 'hidden'
                  }}>
                    <Box
                      sx={{
                        bgcolor: message.role === 'user' ? '#007bff' : '#f8f9fa',
                        color: message.role === 'user' ? 'white' : '#495057',
                        p: 2,
                        borderRadius: message.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                        display: 'inline-block',
                        maxWidth: '100%',
                        wordBreak: 'break-word',
                        overflow: 'hidden',
                        boxShadow: message.role === 'user' ? '0 2px 8px rgba(0,123,255,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                        border: message.role === 'assistant' ? '1px solid #e9ecef' : 'none'
                      }}
                    >
                      <Typography variant="body2" sx={{ 
                        lineHeight: 1.4,
                        fontSize: '0.95rem'
                      }}>
                        {message.content}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ 
                      mt: 0.5, 
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      color: '#6c757d',
                      fontSize: '0.75rem',
                      textAlign: message.role === 'user' ? 'right' : 'left'
                    }}>
                      {formatTimestamp(message.timestamp)}
                    </Typography>
                  </Box>
                  {message.role === 'user' && (
                    <Avatar 
                      sx={{ 
                        ml: 2, 
                        bgcolor: '#007bff',
                        width: 36,
                        height: 36,
                        flexShrink: 0
                      }}
                    >
                      <Person sx={{ fontSize: 20 }} />
                    </Avatar>
                  )}
                </Box>
              </ListItem>
            ))}

            {isTyping && (
              <ListItem sx={{ 
                alignItems: 'flex-start', 
                py: 2, 
                flexDirection: 'column',
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden',
                boxSizing: 'border-box',
                border: 'none'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Avatar 
                    sx={{ 
                      mr: 2, 
                      bgcolor: '#17a2b8',
                      width: 36,
                      height: 36,
                      flexShrink: 0
                    }}
                  >
                    <SmartToy sx={{ fontSize: 20 }} />
                  </Avatar>
                  <Box sx={{
                    bgcolor: '#f8f9fa',
                    color: '#495057',
                    p: 2,
                    borderRadius: '20px 20px 20px 4px',
                    display: 'inline-block'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 6, height: 6, bgcolor: '#adb5bd', borderRadius: '50%', animation: 'blink 1.2s infinite' }} />
                      <Box sx={{ width: 6, height: 6, bgcolor: '#adb5bd', borderRadius: '50%', animation: 'blink 1.2s infinite', animationDelay: '0.2s' }} />
                      <Box sx={{ width: 6, height: 6, bgcolor: '#adb5bd', borderRadius: '50%', animation: 'blink 1.2s infinite', animationDelay: '0.4s' }} />
                    </Box>
                  </Box>
                </Box>
              </ListItem>
            )}
          </List>
        </Box>
        
        <Divider sx={{ bgcolor: '#e9ecef' }} />
        
        <Box sx={{ p: 3, bgcolor: '#ffffff' }}>
          <TextField
            fullWidth
            size="medium"
            variant="outlined"
            placeholder="Escribe tu mensaje..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            multiline
            minRows={1}
            maxRows={6}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '25px',
                bgcolor: '#f8f9fa',
                border: '1px solid #e9ecef',
                '&:hover': {
                  border: '1px solid #dee2e6',
                },
                '&.Mui-focused': {
                  border: '2px solid #007bff',
                  bgcolor: '#ffffff'
                },
                '& fieldset': {
                  border: 'none',
                },
              },
              '& .MuiInputBase-input': {
                py: 1.5,
                px: 2,
                fontSize: '0.95rem'
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#6c757d',
                opacity: 1
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    size="medium"
                    sx={{
                      bgcolor: inputValue.trim() ? '#007bff' : '#e9ecef',
                      color: inputValue.trim() ? 'white' : '#6c757d',
                      borderRadius: '50%',
                      width: 40,
                      height: 40,
                      mr: 0.5,
                      '&:hover': {
                        bgcolor: inputValue.trim() ? '#0056b3' : '#dee2e6',
                      }
                    }}
                  >
                    <Send sx={{ fontSize: 18 }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};
