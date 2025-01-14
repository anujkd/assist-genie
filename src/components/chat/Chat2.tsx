import React, { useState, useRef, useEffect } from "react";
import { Menu, Plus, Paperclip, ImageIcon, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Types
interface Message {
  id: string;
  conversation: string;
  question?: string | null;
  feedback?: string | null;
  modelId: string | null;
  likes: number | null;
  categoryId: string;
  reference: string | null;
}

interface ChatHistory {
  conversationId: string;
  firstQuery: string;
  chatTime: string;
}

interface AIModel {
  name: string;
  version: string;
}

const LoadingIndicator = () => (
  <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg max-w-[80%]">
    <div className="flex gap-1">
      <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
      <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-150" />
      <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-300" />
    </div>
    <span className="text-sm text-gray-500 dark:text-gray-400">AI is thinking...</span>
  </div>
);

const Chat = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [isNewChat, setIsNewChat] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock accountId - in real app, get this from auth context/state
  const accountId = "abc123";

  const suggestions = [
    "Help me write a blog post",
    "Generate some code",
    "Explain a concept",
    "Analyze some data"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    createNewSession();
    fetchChatHistory();
  }, []);

  const toggleTheme = (selectedTheme: "light" | "dark") => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(selectedTheme);
    setTheme(selectedTheme);
  };

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/assist-genie-ai/api/v1/account/${accountId}/conversation/history`
      );
      const data = await response.json();
      setChatHistory(data.conversationHistory);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const createNewSession = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/assist-genie-ai/api/v1/account/${accountId}/conversation/start`,
        {
          method: 'POST',
        }
      );
      const data = await response.json();
      setConversationId(data.conversationId);
      setMessages([]);
      setIsNewChat(true);
      fetchChatHistory(); // Refresh history after creating new session
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const loadConversation = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/assist-genie-ai/api/v1/account/${accountId}/conversation/${id}`
      );
      const data = await response.json();
      setMessages(data.conversation);
      setConversationId(id);
      setIsNewChat(false);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !conversationId) return;

    setIsLoading(true);
    setMessage("");
    setIsNewChat(false);

    const model: AIModel = {
      name: "openAi",
      version: "chatGpt3.5"
    };

    try {
      const response = await fetch(
        `http://localhost:8080/assist-genie-ai/api/v1/account/${accountId}/conversation/${conversationId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: message,
            model
          }),
        }
      );

      const data = await response.json();
      
      // Add both question and response to messages
      const newMessages: Message[] = [
        {
          id: Date.now().toString(),
          conversation: conversationId,
          question: data.question,
          feedback: null,
          modelId: null,
          likes: null,
          categoryId: 'abc',
          reference: null
        },
        {
          id: (Date.now() + 1).toString(),
          conversation: conversationId,
          question: null,
          feedback: data.feedback,
          modelId: null,
          likes: null,
          categoryId: 'abc',
          reference: null
        }
      ];

      setMessages(prev => [...prev, ...newMessages]);
      
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200" data-theme={theme}>
      <main className={`flex-1 max-w-3xl mx-auto w-full p-4 flex flex-col ${isNewChat ? 'justify-center' : ''}`}>
        {messages.length > 0 && (
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.question ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.question
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 dark:text-white'
                  }`}
                >
                  {msg.question || msg.feedback}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <LoadingIndicator />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        <div className={`${isNewChat ? 'text-center' : ''}`}>
          {isNewChat && (
            <h2 className="text-2xl font-bold mb-4 dark:text-white">What can I help with?</h2>
          )}
          
          <div className="relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="pr-24 py-6 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:placeholder-gray-400"
              disabled={isLoading}
            />

            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                disabled={isLoading}
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                disabled={isLoading}
              >
                <ImageIcon className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleSendMessage}
                disabled={isLoading || !message.trim()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {isNewChat && (
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {suggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="secondary"
                  onClick={() => setMessage(suggestion)}
                  disabled={isLoading}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Chat;