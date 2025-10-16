"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "../../lib/auth-client";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { Button, Card, Input } from "@jn704kmvn1w3p5a4xx8aankht17sksat/components";
import { AuthButton } from "../../components/auth-button";
import { Send, Loader2, Bot, User, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { formatRelativeTime } from "../../lib/utils";

export default function AssistantPage() {
  const { data: session, isPending: sessionPending } = useSession();
  const [selectedThreadId, setSelectedThreadId] = useState<Id<"threads"> | null>(null);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const threads = useQuery(api.endpoints.assistant.listThreads, { status: "active" });
  const threadData = selectedThreadId
    ? useQuery(api.endpoints.assistant.getThread, { threadId: selectedThreadId })
    : undefined;

  const createThread = useMutation(api.endpoints.assistant.createThread);
  const sendMessageAction = useAction(api.endpoints.assistant.sendMessage);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threadData?.messages]);

  const handleCreateThread = async () => {
    const threadId = await createThread({ title: "New Conversation" });
    setSelectedThreadId(threadId);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || !selectedThreadId || isSending) return;

    const userMessage = message;
    setMessage("");
    setIsSending(true);

    try {
      await sendMessageAction({
        threadId: selectedThreadId,
        content: userMessage,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessage(userMessage); // Restore message on error
    } finally {
      setIsSending(false);
    }
  };

  if (sessionPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <Bot className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold mb-4">AI Task Assistant</h1>
          <p className="text-lg text-text-secondary mb-8">
            Get help managing your tasks with AI-powered assistance.
          </p>
          <AuthButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-muted bg-surface">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tasks
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Bot className="h-6 w-6 text-primary" />
                AI Assistant
              </h1>
              <p className="text-sm text-text-secondary">Ask for help with your tasks</p>
            </div>
          </div>
          <AuthButton />
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar - Thread List */}
        <aside className="w-64 border-r border-muted bg-surface p-4 space-y-2">
          <Button onClick={handleCreateThread} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>

          <div className="space-y-1">
            {threads === undefined ? (
              <div className="text-center py-4">
                <Loader2 className="h-5 w-5 animate-spin mx-auto text-text-secondary" />
              </div>
            ) : threads.length === 0 ? (
              <p className="text-sm text-text-secondary text-center py-4">
                No conversations yet
              </p>
            ) : (
              threads.map((thread) => (
                <button
                  key={thread._id}
                  onClick={() => setSelectedThreadId(thread._id)}
                  className={`w-full text-left p-3 rounded-md transition-colors ${
                    selectedThreadId === thread._id
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted"
                  }`}
                >
                  <p className="font-medium truncate">{thread.title}</p>
                  <p className="text-xs text-text-secondary">
                    {formatRelativeTime(thread.updatedAt)}
                  </p>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col">
          {selectedThreadId && threadData ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {threadData.messages.length === 0 ? (
                  <div className="text-center py-12">
                    <Bot className="h-16 w-16 mx-auto mb-4 text-text-secondary" />
                    <p className="text-lg font-medium mb-2">Start a conversation</p>
                    <p className="text-text-secondary">
                      Ask me anything about managing your tasks!
                    </p>
                  </div>
                ) : (
                  threadData.messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`flex gap-3 ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {msg.role === "assistant" && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Bot className="h-5 w-5 text-primary" />
                        </div>
                      )}

                      <Card
                        className={`p-4 max-w-2xl ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-surface"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        <p
                          className={`text-xs mt-2 ${
                            msg.role === "user"
                              ? "text-primary-foreground/70"
                              : "text-text-secondary"
                          }`}
                        >
                          {formatRelativeTime(msg.createdAt)}
                        </p>
                      </Card>

                      {msg.role === "user" && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-secondary" />
                        </div>
                      )}
                    </div>
                  ))
                )}

                {isSending && (
                  <div className="flex gap-3 justify-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <Card className="p-4">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </Card>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-muted p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    placeholder="Ask me anything about your tasks..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isSending}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!message.trim() || isSending}>
                    {isSending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center max-w-md">
                <Bot className="h-20 w-20 mx-auto mb-6 text-text-secondary" />
                <h2 className="text-2xl font-bold mb-4">Welcome to AI Assistant</h2>
                <p className="text-text-secondary mb-6">
                  Select an existing conversation or create a new one to get started.
                </p>
                <Button onClick={handleCreateThread}>
                  <Plus className="h-4 w-4 mr-2" />
                  Start New Chat
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
