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
  Paper,
  CircularProgress,
  Fab,
  Menu,
  MenuItem
} from '@mui/material';
import { 
  Send, 
  Person, 
  SmartToy, 
  History,
  Add,
  MoreVert
} from '@mui/icons-material';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../../auth/hooks/useAuth';
import type { ChatMessage, ChatSession } from '../types';

export const ChatComponent: React.FC = () => {
  const { user } = useAuth();
  const { 
    messages,
    sessions,
    currentSessionId,
    currentSession,
    loading,
    isTyping,
    sendQuickMessage,
    startNewChat,
    switchSession,
    deleteChatSession
  } = useChat();
  
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [sessionMenuAnchor, setSessionMenuAnchor] = useState<null | HTMLElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = async () => {
    try {
      await startNewChat();
      setInputValue('');
    } catch (error) {
      console.error('Error starting new chat:', error);
    }
  };

  const handleSessionMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSessionMenuAnchor(event.currentTarget);
  };

  const handleSessionMenuClose = () => {
    setSessionMenuAnchor(null);
  };

  const handleSessionSelect = (sessionId: string) => {
    switchSession(sessionId);
    handleSessionMenuClose();
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteChatSession({ sessionId });
      handleSessionMenuClose();
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!user) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '400px',
          textAlign: 'center'
        }}
      >
        <SmartToy sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Asistente de Viajes IA
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Inicia sesión para comenzar a chatear con nuestro asistente
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          p: 2, 
          borderBottom: 1, 
          borderColor: 'divider',
          bgcolor: 'primary.main',
          color: 'primary.contrastText'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SmartToy sx={{ mr: 2 }} />
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Asistente de Viajes
            </Typography>
            <Typography variant="caption">
              {currentSession?.title || 'Nueva conversación'}
            </Typography>
          </Box>
        </Box>
        
        <Box>
          <IconButton 
            color="inherit" 
            onClick={handleSessionMenuOpen}
            disabled={sessions.length === 0}
          >
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={sessionMenuAnchor}
            open={Boolean(sessionMenuAnchor)}
            onClose={handleSessionMenuClose}
          >
            <MenuItem onClick={handleNewChat}>
              <Add sx={{ mr: 1 }} />
              Nueva conversación
            </MenuItem>
            <Divider />
            {sessions.slice(0, 5).map((session: ChatSession) => (
              <MenuItem 
                key={session.id}
                onClick={() => handleSessionSelect(session.id)}
                selected={session.id === currentSessionId}
              >
                <History sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="body2">
                    {session.title || 'Conversación'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(session.updatedAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>

      {/* Messages Container */}
      <Box 
        ref={messagesContainerRef}
        sx={{ 
          flex: 1, 
          overflowY: 'auto', 
          p: 1,
          bgcolor: 'grey.50'
        }}
      >
        <List sx={{ py: 0 }}>
          {messages.length === 0 && !loading ? (
            <ListItem>
              <Box sx={{ textAlign: 'center', width: '100%', py: 4 }}>
                <SmartToy sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  ¡Hola! Soy tu asistente de viajes. ¿En qué puedo ayudarte hoy?
                </Typography>
              </Box>
            </ListItem>
          ) : (
            messages.map((message: ChatMessage) => (
              <ListItem key={message.id} sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                    mb: 1
                  }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      maxWidth: '70%',
                      bgcolor: message.role === 'user' ? 'primary.main' : 'white',
                      color: message.role === 'user' ? 'primary.contrastText' : 'text.primary',
                      borderRadius: message.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32,
                          bgcolor: message.role === 'user' ? 'primary.dark' : 'secondary.main'
                        }}
                      >
                        {message.role === 'user' ? <Person /> : <SmartToy />}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ mb: 0.5 }}>
                          {message.content}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          {formatTimestamp(message.timestamp)}
                          {message.status === 'sending' && (
                            <CircularProgress size={12} sx={{ ml: 1 }} />
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              </ListItem>
            ))
          )}
          
          {/* Typing indicator */}
          {isTyping && (
            <ListItem>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', mr: 2 }}>
                  <SmartToy />
                </Avatar>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Box 
                    sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      bgcolor: 'text.secondary',
                      animation: 'pulse 1.5s ease-in-out infinite'
                    }} 
                  />
                  <Box 
                    sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      bgcolor: 'text.secondary',
                      animation: 'pulse 1.5s ease-in-out infinite 0.2s'
                    }} 
                  />
                  <Box 
                    sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      bgcolor: 'text.secondary',
                      animation: 'pulse 1.5s ease-in-out infinite 0.4s'
                    }} 
                  />
                </Box>
              </Box>
            </ListItem>
          )}
        </List>
      </Box>

      {/* Input Area */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'white' }}>
        <TextField
          fullWidth
          multiline
          maxRows={3}
          placeholder="Escribe tu mensaje..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton 
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || loading}
                  color="primary"
                >
                  <Send />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
            }
          }}
        />
      </Box>

      {/* Floating Action Button for New Chat */}
      <Fab
        color="primary"
        size="medium"
        onClick={handleNewChat}
        sx={{
          position: 'absolute',
          bottom: 80,
          right: 16,
        }}
      >
        <Add />
      </Fab>
    </Box>
  );
};
