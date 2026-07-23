import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Bot,
  MessageSquare,
  Plus,
  ArrowRight,
  MessagesSquare,
} from "lucide-react";
import { dashboardApi } from "@/api/agents";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";
import { formatRelativeTime, truncate } from "@/lib/utils";

const statCards = [
  { key: "agents" as const, label: "Agents", icon: Bot },
  { key: "conversations" as const, label: "Conversations", icon: MessageSquare },
  { key: "messages" as const, label: "Messages", icon: MessagesSquare },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await dashboardApi.getStats();
      return response.data.data;
    },
  });

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold">
              {greeting()}, {user?.name?.split(" ")[0]}
            </h1>
            <p className="text-muted-foreground mt-1">
              Here&apos;s what&apos;s happening in your workspace
            </p>
          </div>
          <Button asChild>
            <Link to="/agents/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Agent
            </Link>
          </Button>
        </motion.div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card>
                <CardContent className="p-6">
                  {isLoading ? (
                    <Skeleton className="h-16 w-full" />
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-3xl font-bold mt-1">
                          {data?.stats[stat.key] ?? 0}
                        </p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <stat.icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Agents */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Recent Agents</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/agents/new">View all</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : data?.recentAgents.length === 0 ? (
                <EmptyState
                  title="No agents yet"
                  description="Create your first AI agent to get started"
                  action={{ label: "Create Agent", href: "/agents/new" }}
                />
              ) : (
                <div className="space-y-2">
                  {data?.recentAgents.map((agent) => (
                    <Link
                      key={agent.id}
                      to={`/agents/${agent.id}`}
                      className="flex items-center gap-3 rounded-lg p-3 hover:bg-accent transition-colors group"
                    >
                      <span className="text-2xl">{agent.avatar}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{agent.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {agent._count?.chats ?? 0} conversations
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Conversations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : data?.recentChats.length === 0 ? (
                <EmptyState
                  title="No conversations yet"
                  description="Start chatting with an agent to see conversations here"
                />
              ) : (
                <div className="space-y-2">
                  {data?.recentChats.map((chat) => (
                    <Link
                      key={chat.id}
                      to={`/agents/${chat.agent?.id}/chat/${chat.id}`}
                      className="flex items-center gap-3 rounded-lg p-3 hover:bg-accent transition-colors group"
                    >
                      <span className="text-xl">{chat.agent?.avatar}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{chat.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {chat.messages?.[0]
                            ? truncate(chat.messages[0].content, 60)
                            : "No messages yet"}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {formatRelativeTime(chat.updatedAt)}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-3">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link to="/agents/new">
                  <Plus className="h-5 w-5 text-primary" />
                  <span>New Agent</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link to="/profile">
                  <Bot className="h-5 w-5 text-primary" />
                  <span>Edit Profile</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link to="/agents/new">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <span>Start Chat</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
