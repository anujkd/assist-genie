import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, Paperclip, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

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

interface ChatPageProps {
  currentConversationId?: string | null;
  onConversationChange?: (id: string | null) => void;
}

const LoadingIndicator = () => (
  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg max-w-[80%]">
    <div className="flex gap-1">
      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
      <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-150" />
      <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-300" />
    </div>
    <span className="text-sm text-muted-foreground">AI is thinking...</span>
  </div>
);

const ChatPage = ({ currentConversationId, onConversationChange }: ChatPageProps) => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isNewChat, setIsNewChat] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = [
    "Help me write a blog post",
    "Generate some code",
    "Explain a concept",
    "Analyze some data"
  ];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when conversation changes
  useEffect(() => {
    inputRef.current?.focus();
  }, [currentConversationId]);

  // Load conversation from URL or prop
  useEffect(() => {
    const urlConversationId = searchParams.get('id');
    const conversationId = currentConversationId || urlConversationId;
    
    if (conversationId) {
      loadConversation(conversationId);
    } else {
      setMessages([]);
      setIsNewChat(true);
    }
  }, [currentConversationId, searchParams]);

  const loadConversation = async (id: string) => {
    try {
      const accountId = "abc123"; // Replace with actual account ID
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:8080/assist-genie-ai/api/v1/account/${accountId}/conversation/${id}`
      );
      const data = await response.json();
      setMessages(data.conversation);
      setIsNewChat(false);
      if (onConversationChange) {
        onConversationChange(id);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !currentConversationId || isLoading) return;

    setIsLoading(true);
    const currentMessage = message;
    setMessage("");
    setIsNewChat(false);

    try {
      const accountId = "abc123"; // Replace with actual account ID
      const response = await fetch(
        `http://localhost:8080/assist-genie-ai/api/v1/account/${accountId}/conversation/${currentConversationId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: currentMessage,
            model: {
              name: "openAi",
              version: "chatGpt3.5"
            }
          }),
        }
      );

      const data = await response.json();
      
      setMessages(prev => [...prev, 
        {
          id: Date.now().toString(),
          conversation: currentConversationId,
          question: currentMessage,
          feedback: null,
          modelId: null,
          likes: null,
          categoryId: 'abc',
          reference: null
        },
        {
          id: (Date.now() + 1).toString(),
          conversation: currentConversationId,
          question: null,
          feedback: data.feedback,
          modelId: null,
          likes: null,
          categoryId: 'abc',
          reference: null
        }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Optionally show an error message to the user
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
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-background">
      <ScrollArea className="flex-1 p-4">
        {messages.length > 0 ? (
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.question ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] p-3 rounded-lg",
                    msg.question
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
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
        ) : (
          <div className="h-full flex flex-col items-center justify-center max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome to AI Assistant</h2>
            <p className="text-muted-foreground mb-8">How can I help you today?</p>
            <div className="flex flex-wrap gap-2 justify-center">
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
          </div>
        )}
      </ScrollArea>

      <div className="border-t p-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <Input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="pr-32 py-6"
              disabled={isLoading || !currentConversationId}
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
                disabled={isLoading || !message.trim() || !currentConversationId}
                title="Send message"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;