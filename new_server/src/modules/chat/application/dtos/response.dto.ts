export class ChatMessageResponseDto {
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
  context?: string;
  response?: {
    message?: string;
    places?: any[];
    travelPlan?: any;
  };
}

export class ProcessChatResponseDto {
  success: boolean;
  message: string;
  sessionId: string;
  response: {
    message: string;
    places?: any[];
    travelPlan?: any;
  };
  timestamp: string;
}

export class ChatHistoryResponseDto {
  sessionId: string;
  lastActivity: string;
  messages: ChatMessageResponseDto[];
}

export class ChatSessionResponseDto {
  success: boolean;
  sessionId: string;
  messages: ChatMessageResponseDto[];
  lastActivity: string;
}
