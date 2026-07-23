import { useState, useRef, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  Send,
  Copy,
  Check,
  Trash2,
  Plus,
  Settings,
  Loader2,
} from "lucide-react";
import { agentsApi } from "@/api/agents";
import { chatsApi } from "@/api/chats";
import { getErrorMessage } from "@/api/client";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn, formatRelativeTime } from "@/lib/utils";
import { getModelLabel } from "@/lib/constants";
import type { Message } from "@/types";

export default function ChatPage() {
  const { agentId, chatId } = useParams<{ agentId: string; chatId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: agent } = useQuery({
    queryKey: ["agent", agentId],
    queryFn: async () => {
      const response = await agentsApi.getById(agentId!);
      return response.data.data;
    },
    enabled: !!agentId,
  });

  const { data: chatList } = useQuery({
    queryKey: ["chats", agentId],
    queryFn: async () => {
      const response = await chatsApi.getAll(agentId!);
      return response.data.data;
    },
    enabled: !!agentId,
  });

  const { data: chat, isLoading } = useQuery({
    queryKey: ["chat", agentId, chatId],
    queryFn: async () => {
      const response = await chatsApi.getById(agentId!, chatId!);
      return response.data.data;
    },
    enabled: !!agentId && !!chatId,
  });

  const sendMutation = useMutation({
    mutationFn: (content: string) => chatsApi.sendMessage(agentId!, chatId!, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat", agentId, chatId] });
      queryClient.invalidateQueries({ queryKey: ["chats", agentId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setInput("");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const deleteChatMutation = useMutation({
    mutationFn: () => chatsApi.delete(agentId!, chatId!),
    onSuccess: () => {
      toast.success("Conversation deleted");
      navigate(`/agents/${agentId}`);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const createChatMutation = useMutation({
    mutationFn: () => chatsApi.create(agentId!),
    onSuccess: (response) => {
      navigate(`/agents/${agentId}/chat/${response.data.data.id}`);
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages, sendMutation.isPending]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || sendMutation.isPending) return;
    sendMutation.mutate(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = async (message: Message) => {
    await navigator.clipboard.writeText(message.content);
    setCopiedId(message.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const agentModelLabel = getModelLabel(agent?.model);

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <div className="w-64 border-r border-border p-4 space-y-3 hidden lg:block">
          <Skeleton className="h-8 w-full" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
        <div className="flex-1 p-6">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Chat Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-border bg-card">
        <div className="p-4 border-b border-border">
          <Link
            to={`/agents/${agentId}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to agent
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{agent?.avatar}</span>
            <div className="min-w-0">
              <p className="font-medium truncate">{agent?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{agent?.description}</p>
            </div>
          </div>
        </div>

        <div className="p-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => createChatMutation.mutate()}
            disabled={createChatMutation.isPending}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Conversation
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-3 space-y-1">
          {chatList?.map((c) => (
            <Link
              key={c.id}
              to={`/agents/${agentId}/chat/${c.id}`}
              className={cn(
                "block rounded-lg px-3 py-2.5 text-sm transition-colors truncate",
                c.id === chatId
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {c.title}
            </Link>
          ))}
        </div>

        <div className="p-3 border-t border-border">
          <Button variant="ghost" size="sm" className="w-full" asChild>
            <Link to={`/agents/${agentId}/settings`}>
              <Settings className="h-4 w-4 mr-2" />
              Agent Settings
            </Link>
          </Button>
        </div>
      </aside>

      {/* Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Mobile Header */}
        <header className="flex items-center justify-between px-4 h-14 border-b border-border lg:hidden">
          <Link to={`/agents/${agentId}`} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">{agent?.name}</span>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete conversation?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this conversation and all its messages.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteChatMutation.mutate()}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-auto px-4 lg:px-8 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {chat?.messages?.length === 0 && (
              <div className="text-center py-20">
                <span className="text-4xl mb-4 block">{agent?.avatar}</span>
                <h2 className="text-lg font-semibold mb-2">{agent?.name}</h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {agent?.description || "Start a conversation with this agent"}
                </p>
              </div>
            )}

            <AnimatePresence>
              {chat?.messages?.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-3",
                    message.role === "USER" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "ASSISTANT" && (
                    <span className="text-xl shrink-0 mt-1">{agent?.avatar}</span>
                  )}
                  <div
                    className={cn(
                      "group relative max-w-[85%] rounded-xl px-4 py-3",
                      message.role === "USER"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border"
                    )}
                  >
                    {message.role === "ASSISTANT" ? (
                      <MarkdownRenderer content={message.content} />
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    )}
                    <div className="flex items-center justify-between mt-2 gap-4">
                      <span className="text-[10px] opacity-60">
                        {formatRelativeTime(message.createdAt)}
                      </span>
                      {message.role === "ASSISTANT" && (
                        <button
                          onClick={() => handleCopy(message)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {copiedId === message.id ? (
                            <Check className="h-3.5 w-3.5 text-primary" />
                          ) : (
                            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {sendMutation.isPending && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <span className="text-xl">{agent?.avatar}</span>
                <div className="bg-card border border-border rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Thinking...
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-border p-4 lg:px-8">
          <div className="max-w-3xl mx-auto flex gap-3 items-end">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Send a message..."
              rows={1}
              className="min-h-[44px] max-h-32 resize-none"
              disabled={sendMutation.isPending}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || sendMutation.isPending}
              size="icon"
              className="shrink-0 h-11 w-11"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            {agent?.name ? `${agent.name} • ${agentModelLabel}` : agentModelLabel} • Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
