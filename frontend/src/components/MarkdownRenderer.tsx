import { lazy, Suspense, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MarkdownRendererProps {
  content: string;
}

const LazySyntaxHighlighter = lazy(() => import("./CodeHighlighter"));

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose-chat text-sm">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");

            if (match) {
              return <CodeBlock language={match[1]} code={codeString} />;
            }

            return (
              <code
                className="rounded bg-secondary px-1.5 py-0.5 text-xs font-mono"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 bg-secondary/80"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-primary" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
      <Suspense
        fallback={
          <pre className="m-0 overflow-auto rounded-lg bg-zinc-900 p-4 text-[0.8125rem]">
            <code>{code}</code>
          </pre>
        }
      >
        <LazySyntaxHighlighter code={code} language={language} />
      </Suspense>
    </div>
  );
}
