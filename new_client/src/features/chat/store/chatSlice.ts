import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { 
  ChatState, 
  ChatMessage, 
  ChatSession, 
  SendMessageRequest,
  CreateSessionRequest,
  UpdateSessionRequest,
  DeleteSessionRequest,
  GetMessagesRequest,
  GetSessionsRequest
} from '../types';
import { chatService } from '../services/chatService';
import type { RootState } from '../../../app/store';

const initialState: ChatState = {
  messages: [],
  sessions: [],
  currentSessionId: null,
  loading: false,
  error: null,
  isTyping: false
};

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (data: SendMessageRequest, { rejectWithValue, dispatch }) => {
    try {
      // Optimistically add user message
      const userMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        content: data.content,
        role: 'user',
        timestamp: new Date().toISOString(),
        status: 'sending'
      };
      
      dispatch(addMessageOptimistic(userMessage));
      dispatch(setIsTyping(true));
      
      const response = await chatService.sendMessage(data);
      
      // Update user message status and add assistant response
      dispatch(updateMessageStatus({ id: userMessage.id, status: 'sent' }));
      dispatch(setIsTyping(false));
      
      return response;
    } catch (error: any) {
      dispatch(setIsTyping(false));
      return rejectWithValue(error.response?.data?.message || 'Error al enviar mensaje');
    }
  }
);

export const getMessages = createAsyncThunk(
  'chat/getMessages',
  async (params: GetMessagesRequest, { rejectWithValue }) => {
    try {
      return await chatService.getMessages(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener mensajes');
    }
  }
);

export const createSession = createAsyncThunk(
  'chat/createSession',
  async (data: CreateSessionRequest = {}, { rejectWithValue }) => {
    try {
      return await chatService.createSession(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear sesión');
    }
  }
);

export const getSessions = createAsyncThunk(
  'chat/getSessions',
  async (params: GetSessionsRequest = {}, { rejectWithValue }) => {
    try {
      return await chatService.getSessions(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener sesiones');
    }
  }
);

export const getSession = createAsyncThunk(
  'chat/getSession',
  async (sessionId: string, { rejectWithValue }) => {
    try {
      return await chatService.getSession(sessionId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener sesión');
    }
  }
);

export const updateSession = createAsyncThunk(
  'chat/updateSession',
  async (data: UpdateSessionRequest, { rejectWithValue }) => {
    try {
      return await chatService.updateSession(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar sesión');
    }
  }
);

export const deleteSession = createAsyncThunk(
  'chat/deleteSession',
  async (data: DeleteSessionRequest, { rejectWithValue }) => {
    try {
      await chatService.deleteSession(data);
      return data.sessionId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar sesión');
    }
  }
);

export const clearSession = createAsyncThunk(
  'chat/clearSession',
  async (sessionId: string, { rejectWithValue }) => {
    try {
      await chatService.clearSession(sessionId);
      return sessionId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al limpiar sesión');
    }
  }
);

export const exportSession = createAsyncThunk(
  'chat/exportSession',
  async (sessionId: string, { rejectWithValue }) => {
    try {
      return await chatService.exportSession(sessionId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al exportar sesión');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentSession: (state, action: PayloadAction<string | null>) => {
      state.currentSessionId = action.payload;
      if (action.payload !== state.currentSessionId) {
        // Clear messages when switching sessions
        state.messages = [];
      }
    },
    addMessageOptimistic: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    updateMessageStatus: (state, action: PayloadAction<{ id: string; status: ChatMessage['status'] }>) => {
      const message = state.messages.find(m => m.id === action.payload.id);
      if (message) {
        message.status = action.payload.status;
      }
    },
    setIsTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    clearChatError: (state) => {
      state.error = null;
    },
    resetChatState: () => initialState,
    removeMessage: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter(m => m.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        // Add assistant response
        state.messages.push(action.payload.message);
        // Update current session
        if (action.payload.sessionId) {
          state.currentSessionId = action.payload.sessionId;
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isTyping = false;
      })
      
      // Get Messages
      .addCase(getMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.messages;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create Session
      .addCase(createSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSession.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions.unshift(action.payload);
        state.currentSessionId = action.payload.id;
        state.messages = []; // Clear messages for new session
      })
      .addCase(createSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Get Sessions
      .addCase(getSessions.fulfilled, (state, action) => {
        state.sessions = action.payload.sessions;
      })
      
      // Get Session
      .addCase(getSession.fulfilled, (state, action) => {
        const existingIndex = state.sessions.findIndex(s => s.id === action.payload.id);
        if (existingIndex >= 0) {
          state.sessions[existingIndex] = action.payload;
        } else {
          state.sessions.push(action.payload);
        }
      })
      
      // Update Session
      .addCase(updateSession.fulfilled, (state, action) => {
        const index = state.sessions.findIndex(s => s.id === action.payload.id);
        if (index >= 0) {
          state.sessions[index] = action.payload;
        }
      })
      
      // Delete Session
      .addCase(deleteSession.fulfilled, (state, action) => {
        const sessionId = action.payload;
        state.sessions = state.sessions.filter(s => s.id !== sessionId);
        if (state.currentSessionId === sessionId) {
          state.currentSessionId = null;
          state.messages = [];
        }
      })
      
      // Clear Session
      .addCase(clearSession.fulfilled, (state, action) => {
        const sessionId = action.payload;
        if (state.currentSessionId === sessionId) {
          state.messages = [];
        }
        // Update session message count
        const session = state.sessions.find(s => s.id === sessionId);
        if (session) {
          session.messageCount = 0;
          session.lastMessage = undefined;
        }
      });
  }
});

export const {
  setCurrentSession,
  addMessageOptimistic,
  updateMessageStatus,
  setIsTyping,
  clearMessages,
  clearChatError,
  resetChatState,
  removeMessage
} = chatSlice.actions;

// Selectors
export const selectChatMessages = (state: RootState) => state.chat.messages;
export const selectChatSessions = (state: RootState) => state.chat.sessions;
export const selectCurrentSessionId = (state: RootState) => state.chat.currentSessionId;
export const selectChatLoading = (state: RootState) => state.chat.loading;
export const selectChatError = (state: RootState) => state.chat.error;
export const selectIsTyping = (state: RootState) => state.chat.isTyping;
export const selectChatState = (state: RootState) => state.chat;

export const selectCurrentSession = (state: RootState) =>
  state.chat.sessions.find(s => s.id === state.chat.currentSessionId);

export const selectSessionById = (sessionId: string) => (state: RootState) =>
  state.chat.sessions.find(s => s.id === sessionId);

export { chatSlice };
