"use client";

import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Select from "@radix-ui/react-select";
import CodeViewer from "@/components/code-viewer";
import LoadingDots from "@/components/loading-dots";
import {
  CommandLineIcon,
  SparklesIcon,
  LightBulbIcon,
  CodeBracketIcon,
  ArrowPathIcon,
  ClipboardIcon,
  BookOpenIcon,
  ShareIcon,
  StarIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/16/solid";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const CATEGORIES = [
  { id: 'web', label: 'Web Apps', icon: RocketLaunchIcon },
  { id: 'mobile', label: 'Mobile Apps', icon: RocketLaunchIcon },
  { id: 'api', label: 'API Integration', icon: RocketLaunchIcon },
  { id: 'ui', label: 'UI Components', icon: RocketLaunchIcon },
];

const EXAMPLE_PROMPTS = {
  web: [
    "Build a todo app with React and TypeScript",
    "Create a weather dashboard that shows the forecast",
    "Make a markdown editor with preview",
    "Design a simple chat application"
  ],
  mobile: [
    "Create a React Native fitness tracking app",
    "Build a mobile photo sharing app",
    "Design a mobile task management app",
  ],
  api: [
    "Build an OpenAI API integration",
    "Create a REST API with Express",
    "Make a GraphQL server",
  ],
  ui: [
    "Design a modern navbar component",
    "Create an animated card carousel",
    "Build a responsive grid layout",
  ]
};

export default function Home() {
  const [status, setStatus] = useState<"initial" | "creating" | "created" | "updating" | "updated">("initial");
  const [prompt, setPrompt] = useState("");
  const [category, setCategory] = useState<keyof typeof EXAMPLE_PROMPTS>("web");
  const [currentExample, setCurrentExample] = useState(0);
  const [generatedCode, setGeneratedCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const models = [
    { label: "gemini-2.0-flash-exp", value: "gemini-2.0-flash-exp" },
    { label: "gemini-1.5-pro", value: "gemini-1.5-pro" },
    { label: "gemini-1.5-flash", value: "gemini-1.5-flash" },
  ];
  const [model, setModel] = useState(models[0].value);

  const loading = status === "creating" || status === "updating";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExample((prev) => (prev + 1) % EXAMPLE_PROMPTS[category].length);
    }, 3000);
    return () => clearInterval(interval);
  }, [category]);

  async function createApp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status !== "initial") {
      scrollTo({ top: 0, behavior: 'smooth' });
    }
    setStatus("creating");
    setGeneratedCode("");
    
    // Simulate API call
    const response = await fetch("/api/generateCode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) throw new Error(response.statusText);
    
    // Handle streaming response
    const reader = response.body?.getReader();
    let receivedData = "";
    
    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;
      receivedData += new TextDecoder().decode(value);
      setGeneratedCode(receivedData.replace(/```(?:typescript|javascript|tsx)?\n([\s\S]*?)```/g, "$1").trim());
    }

    setStatus("created");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <header className="px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-4xl py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              AI-Powered
              <span className="relative mx-2 whitespace-nowrap">
                <span className="relative bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text px-2 text-transparent">
                  Dynamic UI/UX
                </span>
              </span>
              Studio
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
              Transform your ideas into production-ready code using advanced AI. Choose from templates or describe your custom requirements.
            </p>
          </motion.div>

          {/* Category Selector */}
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {CATEGORIES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCategory(id as keyof typeof EXAMPLE_PROMPTS)}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 ${
                  category === id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
                }`}
              >
                <Icon className="h-6 w-6 text-blue-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4">
        <div className="mx-auto max-w-4xl">
          {/* Templates Section */}
          <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <BookOpenIcon className="h-5 w-5 text-blue-500" />
              Popular Templates
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {EXAMPLE_PROMPTS[category].map((template, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedTemplate(template);
                    setPrompt(template);
                  }}
                  className={`flex items-center justify-between rounded-lg border p-4 text-left transition-all hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 ${
                    selectedTemplate === template
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-800"
                  }`}
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {template}
                  </span>
                  <StarIcon className="h-5 w-5 text-blue-500" />
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={createApp} className="space-y-6">
            <div className="relative rounded-xl border border-gray-200 bg-white shadow-lg transition-all dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-2 dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center gap-2">
                  <CommandLineIcon className="h-5 w-5 text-blue-500" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Describe Your App
                  </span>
                </div>
                <Select.Root value={model} onValueChange={setModel}>
                  <Select.Trigger className="flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300">
                    <SparklesIcon className="h-4 w-4 text-blue-500" />
                    <Select.Value />
                    <Select.Icon>
                      <ChevronDownIcon className="h-4 w-4" />
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
                      <Select.Viewport className="p-1">
                        {models.map((model) => (
                          <Select.Item
                            key={model.value}
                            value={model.value}
                            className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm text-gray-700 outline-none data-[highlighted]:bg-gray-100 dark:text-gray-300 dark:data-[highlighted]:bg-gray-800"
                          >
                            <Select.ItemText>{model.label}</Select.ItemText>
                            <Select.ItemIndicator className="ml-auto">
                              <CheckIcon className="h-4 w-4 text-blue-500" />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>
              
              <textarea
                rows={6}
                required
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full resize-none bg-transparent p-4 text-lg focus:outline-none dark:text-gray-100"
                placeholder="Describe your app idea in detail..."
              />
              
              <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-4 py-2 dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center gap-4">
                  
                </div>
                <button
                  type="submit"
                  disabled={loading || !prompt}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <LoadingDots color="white" style="large" />
                  ) : (
                    <>
                      <CodeBracketIcon className="h-4 w-4" />
                      Generate Code
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Code Output */}
          {status !== "initial" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="my-12"
              
            >
              <div className="rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-2 dark:border-gray-800 dark:bg-gray-900">
                  <div className="flex items-center gap-2">
                    <CodeBracketIcon className="h-5 w-5 text-blue-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Generated Code
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setStatus("updating");
                        createApp(new Event("submit") as any);
                      }}
                      className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                      disabled={loading}
                    >
                      <ArrowPathIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedCode);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <ClipboardIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="relative">
                  <CodeViewer code={generatedCode} showEditor />
                  <AnimatePresence>
                    {loading && (
                      <motion.div
                        initial={status === "updating" ? { x: "100%" } : undefined}
                        animate={{ x: "0%" }}
                        exit={{ x: "100%" }}
                        className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-gray-900/80"
                      >
                        <div className="text-center">
                          <LoadingDots color="black" style="large" />
                          <p className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                            {status === "creating" ? "Generating your code..." : "Updating code..."}
                          </p>
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            This might take a few seconds
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Action Panel */}
                <div className="border-t border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedCode);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                    >
                      {copied ? (
                        <>
                          <CheckIcon className="h-4 w-4 text-green-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <ClipboardIcon className="h-4 w-4" />
                          Copy Code
                        </>
                      )}
                    </button>
                    
                    <button
                      className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      onClick={() => setShowPreview(!showPreview)}
                    >
                      <RocketLaunchIcon className="h-4 w-4" />
                      Preview
                    </button>

                  </div>
                </div>
              </div>

              {/* Additional Resources */}
              <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Next Steps
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                    <h4 className="mb-2 font-medium text-gray-900 dark:text-white">
                      📚 Documentation
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Learn more about the generated code and how to customize it further.
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                    <h4 className="mb-2 font-medium text-gray-900 dark:text-white">
                      🚀 Deploy
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Deploy your application with one click to your preferred platform.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 bg-white py-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-4">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Powered by advanced AI models. Use responsibly.
          </p>
        </div>
      </footer>
    </div>
  );
}
