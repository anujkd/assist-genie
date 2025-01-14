import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, FileText, Image, ThumbsDown, RefreshCw, Copy, Plus, Send, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Types
interface Conversation {
  conversationId: string;
  firstQuery: string;
  chatTime: string;
}

interface ChatMessage {
  id: string;
  conversation: string;
  question: string;
  feedback: string;
  modelId: string | null;
  likes: boolean | null;
  categoryId: string;
  reference: string | null;
}

interface Model {
  name: string;
  version: string;
}

// Main Chat Layout Component
const ChatLayout = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        onConversationSelect={setSelectedConversation}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <ChatArea conversationId={selectedConversation} />
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ 
  onConversationSelect, 
  searchQuery, 
  setSearchQuery 
}: { 
  onConversationSelect: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) => {
  const queryClient = useQueryClient();
  
  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8080/assist-genie-ai/api/v1/account/123/conversation/history');
      const data = await response.json();
      return data.conversationHistory;
    }
  });

  const startNewChat = useMutation({
    mutationFn: async () => {
      const response = await fetch('http://localhost:8080/assist-genie-ai/api/v1/account/123/conversation/start', {
        method: 'POST'
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      onConversationSelect(data.conversationId);
    }
  });

  const filteredConversations = conversations?.filter((conv: Conversation) =>
    conv.firstQuery.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
      <button
        onClick={() => startNewChat.mutate()}
        className="flex items-center justify-center gap-2 w-full p-2 mb-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
      >
        <Plus size={20} />
        New Chat
      </button>
      
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-8 p-2 border rounded-lg"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          filteredConversations?.map((conv: Conversation) => (
            <div
              key={conv.conversationId}
              onClick={() => onConversationSelect(conv.conversationId)}
              className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer mb-2"
            >
              <p className="font-medium truncate">{conv.firstQuery}</p>
              <p className="text-sm text-gray-500">{new Date(conv.chatTime).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Chat Area Component
const ChatArea = ({ conversationId }: { conversationId: string | null }) => {
  const [question, setQuestion] = useState('');
  const [selectedModel, setSelectedModel] = useState<Model>({
    name: 'openAi',
    version: 'chatGpt3.5'
  });

  const queryClient = useQueryClient();

  const { data: conversation, isLoading: isLoadingConversation } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      if (!conversationId) return null;
      const response = await fetch(`http://localhost:8080/assist-genie-ai/api/v1/account/123/conversation/${conversationId}`);
      const data = await response.json();
      return data.conversation;
    },
    enabled: !!conversationId
  });

  const askQuestion = useMutation({
    mutationFn: async () => {
      const response = await fetch(`http://localhost:8080/assist-genie-ai/api/v1/account/123/conversation/${conversationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          model: selectedModel
        }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
      setQuestion('');
    },
  });

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {!conversation?.length && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h1 className="text-2xl font-bold mb-4">What can I help with?</h1>
          </div>
        )}

        {isLoadingConversation ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          conversation?.map((message: ChatMessage) => (
            <div key={message.id} className="mb-6">
              <div className="flex flex-col gap-4">
                <div className="self-start bg-gray-100 rounded-lg p-4 max-w-[80%]">
                  <p>{message.question}</p>
                </div>
                <div className="self-end bg-primary-100 rounded-lg p-4 max-w-[80%]">
                  <p>{message.feedback}</p>
                  <div className="flex gap-2 mt-2">
                    <button className="p-1 hover:bg-primary-200 rounded">
                      <ThumbsDown size={16} />
                    </button>
                    <button className="p-1 hover:bg-primary-200 rounded">
                      <RefreshCw size={16} />
                    </button>
                    <button className="p-1 hover:bg-primary-200 rounded">
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t p-4">
        <div className="flex gap-2 mb-4">
          <Select
            value={`${selectedModel.name}-${selectedModel.version}`}
            onValueChange={(value) => {
              const [name, version] = value.split('-');
              setSelectedModel({ name, version });
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gemini-gemini1.5">Gemini 1.5</SelectItem>
              <SelectItem value="gemini-ultra">Gemini Ultra</SelectItem>
              <SelectItem value="openAi-chatGpt3.5">ChatGPT 3.5</SelectItem>
              <SelectItem value="openAi-chatGpt4">ChatGPT 4</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-3 pr-24 border rounded-lg resize-none"
              rows={1}
            />
            <div className="absolute right-2 top-2.5 flex gap-2">
              <button className="p-1 hover:bg-gray-100 rounded">
                <FileText size={20} />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <Image size={20} />
              </button>
            </div>
          </div>
          <button
            onClick={() => askQuestion.mutate()}
            disabled={!question.trim() || askQuestion.isPending}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {askQuestion.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;