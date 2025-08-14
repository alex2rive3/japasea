import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../app/store';
import {
  sendMessage,
  getMessages,
  createSession,
  getSessions,
  getSession,
  updateSession,
  deleteSession,
  clearSession,
  exportSession,
  setCurrentSession,
  addMessageOptimistic,
  updateMessageStatus,
  setIsTyping,
  clearMessages,
  clearChatError,
  resetChatState,
  removeMessage,
  selectChatMessages,
  selectChatSessions,
  selectCurrentSessionId,
  selectChatLoading,
  selectChatError,
  selectIsTyping,
  selectChatState,
  selectCurrentSession,
  selectSessionById
} from '../store/chatSlice';
import type { 
  SendMessageRequest,
  CreateSessionRequest,
  UpdateSessionRequest,
  DeleteSessionRequest,
  GetMessagesRequest,
  GetSessionsRequest,
  ChatMessage
} from '../types';

export const useChat = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Selectors
  const messages = useSelector(selectChatMessages);
  const sessions = useSelector(selectChatSessions);
  const currentSessionId = useSelector(selectCurrentSessionId);
  const loading = useSelector(selectChatLoading);
  const error = useSelector(selectChatError);
  const isTyping = useSelector(selectIsTyping);
  const chatState = useSelector(selectChatState);
  const currentSession = useSelector(selectCurrentSession);

  // Load sessions on mount
  useEffect(() => {
    dispatch(getSessions({}));
  }, [dispatch]);

  // Load messages when session changes
  useEffect(() => {
    if (currentSessionId) {
      dispatch(getMessages({ sessionId: currentSessionId }));
    }
  }, [currentSessionId, dispatch]);

  // Async actions
  const sendChatMessage = useCallback((data: SendMessageRequest) => {
    return dispatch(sendMessage(data));
  }, [dispatch]);

  const fetchMessages = useCallback((params: GetMessagesRequest) => {
    return dispatch(getMessages(params));
  }, [dispatch]);

  const createChatSession = useCallback((data: CreateSessionRequest = {}) => {
    return dispatch(createSession(data));
  }, [dispatch]);

  const fetchSessions = useCallback((params: GetSessionsRequest = {}) => {
    return dispatch(getSessions(params));
  }, [dispatch]);

  const fetchSession = useCallback((sessionId: string) => {
    return dispatch(getSession(sessionId));
  }, [dispatch]);

  const updateChatSession = useCallback((data: UpdateSessionRequest) => {
    return dispatch(updateSession(data));
  }, [dispatch]);

  const deleteChatSession = useCallback((data: DeleteSessionRequest) => {
    return dispatch(deleteSession(data));
  }, [dispatch]);

  const clearChatSession = useCallback((sessionId: string) => {
    return dispatch(clearSession(sessionId));
  }, [dispatch]);

  const exportChatSession = useCallback((sessionId: string) => {
    return dispatch(exportSession(sessionId));
  }, [dispatch]);

  // Sync actions
  const switchSession = useCallback((sessionId: string | null) => {
    dispatch(setCurrentSession(sessionId));
  }, [dispatch]);

  const addOptimisticMessage = useCallback((message: ChatMessage) => {
    dispatch(addMessageOptimistic(message));
  }, [dispatch]);

  const updateMsgStatus = useCallback((id: string, status: ChatMessage['status']) => {
    dispatch(updateMessageStatus({ id, status }));
  }, [dispatch]);

  const setTyping = useCallback((isTyping: boolean) => {
    dispatch(setIsTyping(isTyping));
  }, [dispatch]);

  const clearChatMessages = useCallback(() => {
    dispatch(clearMessages());
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearChatError());
  }, [dispatch]);

  const resetState = useCallback(() => {
    dispatch(resetChatState());
  }, [dispatch]);

  const removeChatMessage = useCallback((messageId: string) => {
    dispatch(removeMessage(messageId));
  }, [dispatch]);

  // Convenience methods
  const startNewChat = useCallback(async () => {
    try {
      const result = await dispatch(createSession({}));
      if (createSession.fulfilled.match(result)) {
        dispatch(setCurrentSession(result.payload.id));
        return result.payload;
      }
    } catch (error) {
      console.error('Error starting new chat:', error);
    }
  }, [dispatch]);

  const sendQuickMessage = useCallback(async (content: string) => {
    if (!currentSessionId) {
      // Create new session if none exists
      const newSession = await startNewChat();
      if (newSession) {
        return dispatch(sendMessage({ content, sessionId: newSession.id }));
      }
    } else {
      return dispatch(sendMessage({ content, sessionId: currentSessionId }));
    }
  }, [currentSessionId, dispatch, startNewChat]);

  return {
    // State
    messages,
    sessions,
    currentSessionId,
    currentSession,
    loading,
    error,
    isTyping,
    chatState,
    
    // Actions
    sendChatMessage,
    fetchMessages,
    createChatSession,
    fetchSessions,
    fetchSession,
    updateChatSession,
    deleteChatSession,
    clearChatSession,
    exportChatSession,
    
    // Session management
    switchSession,
    startNewChat,
    
    // Message management
    sendQuickMessage,
    addOptimisticMessage,
    updateMsgStatus,
    setTyping,
    clearChatMessages,
    removeChatMessage,
    
    // Utils
    clearError,
    resetState
  };
};

// Hook to get a specific session
export const useChatSession = (sessionId: string) => {
  const session = useSelector((state: RootState) => selectSessionById(sessionId)(state));
  const dispatch = useDispatch<AppDispatch>();
  
  const loadSession = useCallback(() => {
    dispatch(getSession(sessionId));
  }, [sessionId, dispatch]);
  
  return {
    session,
    loadSession
  };
};
