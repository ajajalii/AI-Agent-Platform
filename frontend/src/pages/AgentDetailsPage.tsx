import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  MessageSquare,
  Settings,
  Trash2,
  Plus,
  ArrowRight,
  FileText,
  Upload,
} from "lucide-react";
import { agentsApi } from "@/api/agents";
import { chatsApi } from "@/api/chats";
import { filesApi } from "@/api/files";
import { getErrorMessage } from "@/api/client";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { formatRelativeTime, truncate } from "@/lib/utils";

export default function AgentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: agent, isLoading } = useQuery({
    queryKey: ["agent", id],
    queryFn: async () => {
      const response = await agentsApi.getById(id!);
      return response.data.data;
    },
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => agentsApi.delete(id!),
    onSuccess: () => {
      toast.success("Agent deleted");
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      navigate("/dashboard");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const createChatMutation = useMutation({
    mutationFn: () => chatsApi.create(id!),
    onSuccess: (response) => {
      navigate(`/agents/${id}/chat/${response.data.data.id}`);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await filesApi.upload(id!, file);
      toast.success("File uploaded");
      queryClient.invalidateQueries({ queryKey: ["agent", id] });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </AppLayout>
    );
  }

  if (!agent) return null;

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
            <div className="flex items-start gap-4">
              <span className="text-4xl">{agent.avatar}</span>
              <div>
                <h1 className="text-2xl font-bold">{agent.name}</h1>
                {agent.description && (
                  <p className="text-muted-foreground mt-1">{agent.description}</p>
                )}
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>{agent.model}</span>
                  <span>Temp: {agent.temperature}</span>
                  <span>Created {formatRelativeTime(agent.createdAt)}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => createChatMutation.mutate()}
                disabled={createChatMutation.isPending}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                New Chat
              </Button>
              <Button variant="outline" asChild>
                <Link to={`/agents/${id}/settings`}>
                  <Settings className="h-4 w-4" />
                </Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete agent?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete {agent.name} and all its conversations.
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteMutation.mutate()}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* System Prompt Preview */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">System Prompt</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {agent.systemPrompt}
              </p>
            </CardContent>
          </Card>

          {/* Conversations */}
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Conversations</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => createChatMutation.mutate()}
                disabled={createChatMutation.isPending}
              >
                <Plus className="h-4 w-4 mr-1" />
                New
              </Button>
            </CardHeader>
            <CardContent>
              {agent.chats?.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-4">No conversations yet</p>
                  <Button
                    size="sm"
                    onClick={() => createChatMutation.mutate()}
                    disabled={createChatMutation.isPending}
                  >
                    Start chatting
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {agent.chats?.map((chat) => (
                    <Link
                      key={chat.id}
                      to={`/agents/${id}/chat/${chat.id}`}
                      className="flex items-center gap-3 rounded-lg p-3 hover:bg-accent transition-colors group"
                    >
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{chat.title}</p>
                        {chat.messages?.[0] && (
                          <p className="text-xs text-muted-foreground truncate">
                            {truncate(chat.messages[0].content, 80)}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(chat.updatedAt)}
                      </span>
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Files */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Knowledge Files</CardTitle>
              <label>
                <input
                  type="file"
                  accept=".pdf,.txt,.docx"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button variant="ghost" size="sm" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-1" />
                    Upload
                  </span>
                </Button>
              </label>
            </CardHeader>
            <CardContent>
              {agent.files?.length === 0 ? (
                <div className="text-center py-6">
                  <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Upload PDF, TXT, or DOCX files
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {agent.files?.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-3 rounded-lg p-3 bg-secondary/50"
                    >
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{file.originalName}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}
