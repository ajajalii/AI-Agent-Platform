import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { agentsApi } from "@/api/agents";
import { getErrorMessage } from "@/api/client";
import { AGENT_AVATARS, MODELS, getModelLabel } from "@/lib/constants";
import type { CreateAgentInput } from "@/types";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export default function AgentSettingsPage() {
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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateAgentInput>();

  const selectedAvatar = watch("avatar");
  const temperature = watch("temperature");
  const selectedModel = watch("model");
  const selectedModelExists = MODELS.some((model) => model.value === selectedModel);

  useEffect(() => {
    if (agent) {
      reset({
        name: agent.name,
        description: agent.description || "",
        avatar: agent.avatar,
        systemPrompt: agent.systemPrompt,
        model: agent.model,
        temperature: agent.temperature,
      });
    }
  }, [agent, reset]);

  const mutation = useMutation({
    mutationFn: (data: Partial<CreateAgentInput>) => agentsApi.update(id!, data),
    onSuccess: () => {
      toast.success("Agent updated");
      queryClient.invalidateQueries({ queryKey: ["agent", id] });
      navigate(`/agents/${id}`);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-6 lg:p-8 max-w-3xl mx-auto">
          <Skeleton className="h-96 w-full" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Agent Settings</h1>
            <p className="text-muted-foreground mt-1">
              Update {agent?.name}&apos;s configuration
            </p>
          </div>

          <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label>Avatar</Label>
                  <div className="flex flex-wrap gap-2">
                    {AGENT_AVATARS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setValue("avatar", emoji)}
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg border text-xl transition-colors",
                          selectedAvatar === emoji
                            ? "border-primary bg-primary/10"
                            : "border-border hover:bg-accent"
                        )}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" {...register("name", { required: "Name is required" })} />
                  {errors.name && (
                    <p className="text-xs text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" {...register("description")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="systemPrompt">System Prompt</Label>
                  <Textarea
                    id="systemPrompt"
                    rows={8}
                    {...register("systemPrompt", { required: "System prompt is required" })}
                  />
                  {errors.systemPrompt && (
                    <p className="text-xs text-destructive">{errors.systemPrompt.message}</p>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Model</Label>
                    <Select
                      value={selectedModel}
                      onValueChange={(v) => setValue("model", v)}
                    >
                      <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedModel && !selectedModelExists && (
                        <SelectItem value={selectedModel}>
                          {getModelLabel(selectedModel)}
                        </SelectItem>
                      )}
                      {MODELS.map((model) => (
                        <SelectItem key={model.value} value={model.value}>
                          {model.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Temperature: {temperature?.toFixed(1)}</Label>
                    <Slider
                      value={[temperature ?? 0.7]}
                      onValueChange={([v]) => setValue("temperature", v)}
                      min={0}
                      max={2}
                      step={0.1}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AppLayout>
  );
}
