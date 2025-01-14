import React, { useState, useEffect } from "react";
import { X, Search, MessageSquarePlus, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ChatHistory {
  conversationId: string;
  firstQuery: string;
  chatTime: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  chatHistory: ChatHistory[];
  onChatSelect: (id: string) => void;
  onNewChat: () => void;
  currentConversationId: string | null;
  onDeleteChat?: (id: string) => void;
}

const Sidebar = ({
  isOpen,
  onClose,
  chatHistory,
  onChatSelect,
  onNewChat,
  currentConversationId,
  onDeleteChat
}: SidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredHistory, setFilteredHistory] = useState<ChatHistory[]>([]);

  // Update filtered history when search query or chat history changes
  useEffect(() => {
    const filtered = chatHistory.filter((chat) =>
      chat.firstQuery.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredHistory(filtered);
  }, [searchQuery, chatHistory]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  // Handle chat item click with delete option
  const handleChatItemClick = (e: React.MouseEvent, chatId: string) => {
    // If clicking delete button, stop propagation and delete
    if ((e.target as HTMLElement).closest('[data-delete-button]')) {
      e.stopPropagation();
      onDeleteChat?.(chatId);
      return;
    }
    onChatSelect(chatId);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-80 bg-background border-r z-50",
          "transform transition-transform duration-200 ease-in-out",
          "lg:transform-none lg:transition-none",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Chat History</h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onClose}
                className="lg:hidden"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <Button
              onClick={onNewChat}
              className="w-full justify-start gap-2"
              variant="default"
            >
              <MessageSquarePlus className="h-4 w-4" />
              New Chat
            </Button>
          </div>

          {/* Search */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Chat History */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {filteredHistory.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground p-4">
                  {searchQuery ? "No matches found" : "No conversations yet"}
                </div>
              ) : (
                filteredHistory.map((chat) => (
                  <TooltipProvider key={chat.conversationId}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          onClick={(e) => handleChatItemClick(e, chat.conversationId)}
                          className={cn(
                            "group flex items-center gap-3 rounded-lg p-3 text-sm",
                            "hover:bg-accent cursor-pointer",
                            currentConversationId === chat.conversationId && "bg-accent",
                          )}
                        >
                          <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                          <div className="flex-1 overflow-hidden">
                            <p className="truncate">
                              {chat.firstQuery}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatTimeAgo(chat.chatTime)}
                            </p>
                          </div>
                          {onDeleteChat && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 h-8 w-8"
                              data-delete-button
                              onClick={(e) => handleChatItemClick(e, chat.conversationId)}
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{chat.firstQuery}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(chat.chatTime).toLocaleString()}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
};

export default Sidebar;