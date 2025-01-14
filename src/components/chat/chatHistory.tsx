import React, { useState } from 'react';
import { Search, X, Plus, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatHistory {
  conversionId: string;
  firstQuery: string;
  chatTime: string;
}

interface ChatSidebarProps {
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onEditChat: (id: string) => void;
  onNewChat: () => void;
}

const ChatSidebar = ({ onSelectChat, onDeleteChat, onEditChat, onNewChat }: ChatSidebarProps) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch chat history
  React.useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/history');
        const data = await response.json();
        setChatHistory(data.conversationHistory);
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Filter chat history based on search query
  const filteredHistory = chatHistory.filter(chat =>
    chat.firstQuery.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-80 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="h-16 px-4 border-b border-gray-200 flex items-center justify-between">
        {isSearchVisible ? (
          <div className="flex-1 flex items-center gap-2">
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsSearchVisible(false);
                setSearchQuery('');
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchVisible(true)}
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              onClick={onNewChat}
              variant="ghost"
              size="icon"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Chat History List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading conversations...</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <p className="text-gray-500 text-center">No conversations found</p>
            <Button
              variant="outline"
              onClick={onNewChat}
              className="mt-4"
            >
              Start a new chat
            </Button>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredHistory.map((chat) => (
              <div
                key={chat.conversionId}
                className="group relative flex items-center p-3 rounded-lg hover:bg-secondary cursor-pointer"
                onClick={() => onSelectChat(chat.conversionId)}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {chat.firstQuery}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(chat.chatTime)}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEditChat(chat.conversionId)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => onDeleteChat(chat.conversionId)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;