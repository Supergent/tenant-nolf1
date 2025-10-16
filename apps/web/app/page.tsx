"use client";

import { useSession } from "../lib/auth-client";
import { Tabs } from "@jn704kmvn1w3p5a4xx8aankht17sksat/components";
import { AuthButton } from "../components/auth-button";
import { TaskStats } from "../components/task-stats";
import { CreateTaskForm } from "../components/create-task-form";
import { TaskList } from "../components/task-list";
import { CheckCircle2, ListTodo, Clock, Archive, Bot } from "lucide-react";
import Link from "next/link";
import { Button } from "@jn704kmvn1w3p5a4xx8aankht17sksat/components";

export default function Page() {
  const { data: session, isPending } = useSession();

  if (isPending) {
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
          <h1 className="text-4xl font-bold mb-4">Minimal Todo</h1>
          <p className="text-lg text-text-secondary mb-8">
            A clean, minimal to-do list application with real-time synchronization and AI assistance.
          </p>
          <AuthButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-muted bg-surface">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Minimal Todo</h1>
            <p className="text-sm text-text-secondary">Stay organized, stay productive</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/assistant">
              <Button variant="outline">
                <Bot className="h-4 w-4 mr-2" />
                AI Assistant
              </Button>
            </Link>
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <TaskStats />

        {/* Create Task */}
        <CreateTaskForm />

        {/* Task Lists */}
        <Tabs defaultValue="all" className="w-full">
          <Tabs.List className="grid w-full grid-cols-4">
            <Tabs.Trigger value="all" className="flex items-center gap-2">
              <ListTodo className="h-4 w-4" />
              All Tasks
            </Tabs.Trigger>
            <Tabs.Trigger value="todo" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              To Do
            </Tabs.Trigger>
            <Tabs.Trigger value="in_progress" className="flex items-center gap-2">
              <Archive className="h-4 w-4" />
              In Progress
            </Tabs.Trigger>
            <Tabs.Trigger value="completed" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Completed
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="all" className="mt-6">
            <TaskList />
          </Tabs.Content>

          <Tabs.Content value="todo" className="mt-6">
            <TaskList status="todo" />
          </Tabs.Content>

          <Tabs.Content value="in_progress" className="mt-6">
            <TaskList status="in_progress" />
          </Tabs.Content>

          <Tabs.Content value="completed" className="mt-6">
            <TaskList status="completed" />
          </Tabs.Content>
        </Tabs>
      </main>
    </div>
  );
}
