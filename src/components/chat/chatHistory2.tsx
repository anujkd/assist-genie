import React, { useState, useEffect } from 'react';
import { Search, X, Plus, MoreVertical, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
}

interface ChatSidebarProps {
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onEditChat: (id: string, newTitle: string) => void;
  onNewChat: () => void;
  onCloseSidebar: () => void;
  selectedChatId?: string;
  className?: string;
}

const ChatSidebar = ({
  onSelectChat,
  onDeleteChat,
  onEditChat,
  onNewChat,
  onCloseSidebar,
  selectedChatId,
  className
}: ChatSidebarProps) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setIsLoading(true);
        // Mock data - replace with actual API call
        const mockData: Chat[] = [
          {
            id: '1',
            title: 'First Chat',
            lastMessage: 'Hello there!',
            timestamp: new Date().toISOString()
          },
          {
            id: '2',
            title: 'Second Chat',
            lastMessage: 'How are you?',
            timestamp: new Date().toISOString()
          }
        ];
        setChats(mockData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load chats');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, []);

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleDeleteChat = async (chatId: string) => {
    if (window.confirm('Are you sure you want to delete this chat?')) {
      try {
        await onDeleteChat(chatId);
        setChats(chats.filter(chat => chat.id !== chatId));
      } catch (err) {
        setError('Failed to delete chat');
      }
    }
  };

  const handleEditSubmit = async (chatId: string, newTitle: string) => {
    try {
      await onEditChat(chatId, newTitle);
      setChats(chats.map(chat => 
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      ));
      setEditingChatId(null);
    } catch (err) {
      setError('Failed to update chat title');
    }
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-background border-r",
      className
    )}>
      {/* Header */}
      <div className="h-16 px-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
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
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onCloseSidebar}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <p className="text-destructive">{error}</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4">
            {searchQuery ? (
              <p className="text-muted-foreground text-center">
                No conversations found matching "{searchQuery}"
              </p>
            ) : (
              <>
                <p className="text-muted-foreground text-center">No conversations yet</p>
                <Button
                  variant="outline"
                  onClick={onNewChat}
                  className="mt-4"
                >
                  Start a new chat
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                className={cn(
                  "group relative flex items-center p-3 rounded-lg hover:bg-accent cursor-pointer",
                  selectedChatId === chat.id && "bg-accent"
                )}
                onClick={() => onSelectChat(chat.id)}
              >
                <div className="flex-1 min-w-0">
                  {editingChatId === chat.id ? (
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleEditSubmit(chat.id, editTitle);
                        } else if (e.key === 'Escape') {
                          setEditingChatId(null);
                        }
                      }}
                      autoFocus
                      className="h-7"
                    />
                  ) : (
                    <>
                      <p className="text-sm font-medium truncate">
                        {chat.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {chat.lastMessage}
                      </p>
                    </>
                  )}
                </div>
                <span className="text-xs text-muted-foreground ml-2">
                  {formatDate(chat.timestamp)}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 h-8 w-8"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingChatId(chat.id);
                        setEditTitle(chat.title);
                      }}
                    >
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChat(chat.id);
                      }}
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