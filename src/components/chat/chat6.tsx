

// src/app/chat/page.tsx
import React, { useState, useRef, useEffect } from "react";
import { 
  Menu, 
  Plus, 
  Paperclip, 
  ImageIcon, 
  Send, 
  ThumbsUp, 
  ThumbsDown, 
  RefreshCw, 
  Copy, 
  Check,
  Sun,
  Moon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from 'react-markdown';
import { Toaster } from "@/components/ui/toaster";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

// Types
type ModelOption = {
  provider: string;
  model: string;
  displayName: string;
};

const modelOptions: ModelOption[] = [
  { provider: "gemini", model: "gemini-1.5", displayName: "Gemini 1.5" },
  { provider: "gemini", model: "gemini-ultra", displayName: "Gemini Ultra" },
  { provider: "openai", model: "gpt-3", displayName: "ChatGPT 3.0" },
  { provider: "openai", model: "gpt-4", displayName: "ChatGPT 4.0" },
];

interface Message {
  id: string;
  conversation: string;
  question?: string | null;
  feedback?: string | null;
  modelId: string | null;
  likes: number | null;
  categoryId: string;
  reference: string | null;
  isLiked?: boolean;
  isDisliked?: boolean;
  timestamp: Date;
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

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  chatHistory: ChatHistory[];
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  currentConversationId: string | null;
}

// Components
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

const MessageActions = ({ 
  message, 
  onLike, 
  onDislike, 
  onRefresh, 
  onCopy 
}: { 
  message: Message;
  onLike: () => void;
  onDislike: () => void;
  onRefresh: () => void;
  onCopy: () => void;
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await onCopy();
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <Button
        variant="ghost"
        size="icon"
        className={`transition-colors ${message.isLiked ? "text-green-500" : ""}`}
        onClick={onLike}
      >
        <ThumbsUp className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`transition-colors ${message.isDisliked ? "text-red-500" : ""}`}
        onClick={onDislike}
      >
        <ThumbsDown className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onRefresh}
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCopy}
      >
        {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  chatHistory,
  onSelectChat,
  onNewChat,
  currentConversationId
}) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 w-64 bg-gray-50 dark:bg-gray-800 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-200 ease-in-out z-30`}
    >
      <div className="p-4">
        <Button
          onClick={onNewChat}
          className="w-full mb-4"
          variant="default"
        >
          <Plus className="mr-2 h-4 w-4" /> New Chat
        </Button>
        
        <div className="space-y-2">
          {chatHistory.map((chat) => (
            <Button
              key={chat.conversationId}
              onClick={() => onSelectChat(chat.conversationId)}
              variant={currentConversationId === chat.conversationId ? "secondary" : "ghost"}
              className="w-full justify-start text-left"
            >
              <span className="truncate">{chat.firstQuery}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

const Chat = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isNewChat, setIsNewChat] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelOption>(modelOptions[0]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
    // Check system theme preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme("dark");
    }
    createNewSession();
    fetchChatHistory();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    document.documentElement.classList.remove(theme);
    document.documentElement.classList.add(newTheme);
    setTheme(newTheme);
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
      toast({
        title: "Error fetching chat history",
        variant: "destructive",
      });
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
      fetchChatHistory();
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: "Error creating new session",
        variant: "destructive",
      });
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
      setIsSidebarOpen(false);
    } catch (error) {
      console.error('Error loading conversation:', error);
      toast({
        title: "Error loading conversation",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !conversationId) return;

    setIsLoading(true);
    const currentMessage = message;
    setMessage("");
    setIsNewChat(false);

    const model: AIModel = {
      name: selectedModel.provider,
      version: selectedModel.model
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
            question: currentMessage,
            model
          }),
        }
      );

      const data = await response.json();
      
      const newMessages: Message[] = [
        {
          id: Date.now().toString(),
          conversation: conversationId,
          question: currentMessage,
          feedback: null,
          modelId: null,
          likes: null,
          categoryId: 'abc',
          reference: null,
          timestamp: new Date()
        },
        {
          id: (Date.now() + 1).toString(),
          conversation: conversationId,
          question: null,
          feedback: data.feedback,
          modelId: null,
          likes: null,
          categoryId: 'abc',
          reference: null,
          timestamp: new Date()
        }
      ];

      setMessages(prev => [...prev, ...newMessages]);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error sending message",
        variant: "destructive",
      });
      setMessage(currentMessage); // Restore message if failed
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

  const handleLike = async (messageId: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          isLiked: !msg.isLiked,
          isDisliked: false
        };
      }
      return msg;
    }));

    try {
      await fetch(`http://localhost:8080/assist-genie-ai/api/v1/message/${messageId}/like`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Error saving like:', error);
      toast({
        title: "Error saving feedback",
        variant: "destructive",
      });
    }
  };

  const handleDislike = async (messageId: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          isDisliked: !msg.isDisliked,
          isLiked: false
        };
      }
      return msg;
    }));

    try {
      await fetch(`http://localhost:8080/assist-genie-ai/api/v1/message/${messageId}/dislike`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Error saving dislike:', error);
      toast({
        title: "Error saving feedback",
        variant: "destructive",
      });
    }
  };

  const handleRefreshResponse = async (messageId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/assist-genie-ai/api/v1/message/${messageId}/regenerate`,
        { method: 'POST' }
      );
      const data = await response.json();
      
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            feedback: data.feedback
          };
        }
        return msg;
      }));
    } catch (error) {
      console.error('Error regenerating response:', error);
      toast({
        title: "Error regenerating response",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to clipboard",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: "Failed to copy",
        variant: "destructive",
        duration: 2000,
      });
    }
  };
  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200" data-theme={theme}>
      {/* Header */}
      <header className="border-b dark:border-gray-700">
        <div className="max-w-3xl mx-auto w-full px-4 py-2 flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[200px] justify-between">
                  {selectedModel.displayName}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {modelOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.model}
                    onClick={() => setSelectedModel(option)}
                  >
                    {option.displayName}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        chatHistory={chatHistory}
        onSelectChat={loadConversation}
        onNewChat={createNewSession}
        currentConversationId={conversationId}
      />

      {/* Main content */}
      <main className={`flex-1 max-w-3xl mx-auto w-full p-4 flex flex-col ${isNewChat ? 'justify-center' : ''}`}>
        {messages.length > 0 && (
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.question ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex flex-col max-w-[80%]">
                  <div
                    className={`p-3 rounded-lg ${
                      msg.question
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 dark:text-white'
                    }`}
                  >
                    {msg.question ? (
                      <div className="whitespace-pre-wrap">{msg.question}</div>
                    ) : (
                      <ReactMarkdown 
                        className="prose dark:prose-invert max-w-none"
                        components={{
                          code({ node, inline, className, children, ...props }) {
                            return (
                              <code
                                className={`${className} bg-gray-200 dark:bg-gray-700 rounded px-1 py-0.5`}
                                {...props}
                              >
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {msg.feedback || ''}
                      </ReactMarkdown>
                    )}
                  </div>
                  {!msg.question && (
                    <MessageActions
                      message={msg}
                      onLike={() => handleLike(msg.id)}
                      onDislike={() => handleDislike(msg.id)}
                      onRefresh={() => handleRefreshResponse(msg.id)}
                      onCopy={() => handleCopyMessage(msg.feedback || '')}
                    />
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
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
            <>
              <h2 className="text-2xl font-bold mb-4 dark:text-white">What can I help with?</h2>
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {suggestions.map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="secondary"
                    onClick={() => setMessage(suggestion)}
                    disabled={isLoading}
                    className="text-sm"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </>
          )}
          
          <div className="flex flex-col gap-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your message here..."
              className="min-h-[100px] resize-none dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:placeholder-gray-400"
              disabled={isLoading}
            />

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  disabled={isLoading}
                  title="Attach file"
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  disabled={isLoading}
                  title="Attach image"
                >
                  <ImageIcon className="h-5 w-5" />
                </Button>
              </div>
              <Button 
                onClick={handleSendMessage}
                disabled={isLoading || !message.trim()}
                className="px-4"
              >
                <Send className="h-5 w-5 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
};

export default Chat;