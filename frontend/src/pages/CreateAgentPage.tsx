import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { agentsApi } from "@/api/agents";
import { getErrorMessage } from "@/api/client";
import { AGENT_TEMPLATES, AGENT_AVATARS, MODELS, DEFAULT_MODEL } from "@/lib/constants";
import type { CreateAgentInput } from "@/types";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export default function CreateAgentPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateAgentInput>({
    defaultValues: {
      avatar: "🤖",
      model: DEFAULT_MODEL,
      temperature: 0.7,
      systemPrompt: "",
    },
  });

  const selectedAvatar = watch("avatar");
  const temperature = watch("temperature");
  const selectedModel = watch("model");

  const mutation = useMutation({
    mutationFn: (data: CreateAgentInput) => agentsApi.create(data),
    onSuccess: (response) => {
      toast.success("Agent created successfully!");
      navigate(`/agents/${response.data.data.id}`);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const applyTemplate = (template: (typeof AGENT_TEMPLATES)[number]) => {
    setValue("name", template.name);
    setValue("description", template.description);
    setValue("avatar", template.avatar);
    setValue("systemPrompt", template.systemPrompt);
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Create Agent</h1>
            <p className="text-muted-foreground mt-1">
              Configure a new AI agent for your workspace
            </p>
          </div>

          {/* Templates */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Start from a template</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-2">
                {AGENT_TEMPLATES.map((template) => (
                  <button
                    key={template.name}
                    type="button"
                    onClick={() => applyTemplate(template)}
                    className="flex items-start gap-3 rounded-lg border border-border p-3 text-left hover:border-primary/30 hover:bg-accent/50 transition-colors"
                  >
                    <span className="text-xl">{template.avatar}</span>
                    <div>
                      <p className="text-sm font-medium">{template.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {template.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

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
                  <Input
                    id="name"
                    placeholder="My AI Agent"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="What does this agent do?"
                    {...register("description")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="systemPrompt">System Prompt</Label>
                  <Textarea
                    id="systemPrompt"
                    placeholder="Define the agent's personality and behavior..."
                    rows={6}
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
                {mutation.isPending ? "Creating..." : "Create Agent"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AppLayout>
  );
}
