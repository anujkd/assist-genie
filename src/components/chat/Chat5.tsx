import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  Menu, 
  Plus, 
  Paperclip, 
  ImageIcon, 
  Send,
  Sun,
  Moon,
  ThumbsUp, 
  ThumbsDown, 
  RefreshCw, 
  Copy, 
  Check 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';

// Types
export interface Message {
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

export interface ChatHistory {
  conversationId: string;
  firstQuery: string;
  chatTime: string;
}

export interface AIModel {
  name: string;
  version: string;
}

// LoadingIndicator Component
export const LoadingIndicator = () => (
  <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg max-w-[80%]">
    <div className="flex gap-1">
      <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
      <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-150" />
      <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-300" />
    </div>
    <span className="text-sm text-gray-500 dark:text-gray-400">AI is thinking...</span>
  </div>
);

// MessageContent Component
export const MessageContent = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className="prose dark:prose-invert max-w-none"
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
              className="rounded-md"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
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
      {content}
    </ReactMarkdown>
  );
};

// MessageActions Component
interface MessageActionsProps {
  message: Message;
  onLike: () => void;
  onDislike: () => void;
  onRefresh: () => void;
  onCopy: () => void;
}

export const MessageActions: React.FC<MessageActionsProps> = ({
  message,
  onLike,
  onDislike,
  onRefresh,
  onCopy,
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
      <Button variant="ghost" size="icon" onClick={onRefresh}>
        <RefreshCw className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={handleCopy}>
        {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
};

// Sidebar Component
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  chatHistory: ChatHistory[];
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  currentConversationId: string | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  chatHistory,
  onSelectChat,
  onNewChat,
  currentConversationId,
}) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 w-64 bg-gray-50 dark:bg-gray-800 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-200 ease-in-out z-30`}
    >
      <div className="p-4">
        <Button onClick={onNewChat} className="w-full mb-4" variant="default">
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

// Main Chat Component
const Chat = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isNewChat, setIsNewChat] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
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

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        chatHistory={chatHistory}
        onSelectChat={() => {}} // Implement loadConversation function
        onNewChat={() => {}} // Implement createNewSession function
        currentConversationId={conversationId}
      />

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
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={isLoading || !message.trim()}
                    title="Send message"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </main>
      <Toaster />
    </div>
  );
};

export default Chat;