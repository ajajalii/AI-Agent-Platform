import favicon from "@/assets/favicon.png";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bot,
  MessageSquare,
  Sparkles,
  Shield,
  ArrowRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/ui/tailwind-css-background-snippet";
import logoSrc from "@/assets/Logo.png";

const features = [
  {
    icon: Bot,
    title: "Custom AI Agents",
    description: "Create specialized agents with unique personalities, system prompts, and model configurations.",
  },
  {
    icon: MessageSquare,
    title: "Contextual Conversations",
    description: "Every chat maintains full context. Your agents remember the conversation and respond intelligently.",
  },
  {
    icon: Sparkles,
    title: "Powered by Gemini",
    description: "Leverage Google's latest Gemini models for fast, accurate, and creative AI responses.",
  },
  {
    icon: Shield,
    title: "Secure Workspace",
    description: "Your data is isolated and protected. JWT authentication ensures only you access your agents.",
  },
];

const plans = [
  "Unlimited agents",
  "Persistent chat history",
  "Custom system prompts",
  "File uploads",
  "Multiple AI models",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center">
            <img src={logoSrc} alt="Logo" className="h-9 w-auto object-contain" />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-40 pb-50 px-6">
        <div className="absolute inset-0">
          <Hero />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-4 rounded-full border border-border bg-card px-8 py-1.5 text-sm text-muted-foreground mb-18">
              <img
                src={favicon}
                alt="Logo"
                className="h-3.5 w-3.5 object-contain"
              />
              AI-powered workspace for teams and individuals
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Build intelligent agents.
              <br />
              <span className="text-primary">Ship faster.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Create, configure, and interact with AI agents tailored to your workflow.
              From customer support to code review, your workspace, your rules.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/register">
                  Start for free
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Sign in to workspace</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              A complete platform for building and managing AI agents in one secure workspace.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <h2 className="text-2xl font-bold mb-6">Ready to build your first agent?</h2>
            <ul className="grid sm:grid-cols-2 gap-3 text-left max-w-md mx-auto mb-8">
              {plans.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Button size="lg" asChild>
              <Link to="/register">
                Create your workspace
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <img src={logoSrc} alt="Logo" className="h-8 w-auto object-contain" />
          </div>
          <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
