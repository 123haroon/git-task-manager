"use client";

import { useReducer, type FormEvent } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, ListTodo, Trash2 } from "lucide-react";

type Task = {
  id: string;
  title: string;
};

type TaskState = {
  input: string;
  tasks: Task[];
};

type TaskAction =
  | { type: "SET_INPUT"; payload: string }
  | { type: "ADD_TASK" }
  | { type: "DELETE_TASK"; payload: string };

const initialState: TaskState = {
  input: "",
  tasks: [
    { id: "1", title: "Setup Next.js project" },
    { id: "2", title: "Learn Git and GitHub" },
  ],
};

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case "SET_INPUT":
      return {
        ...state,
        input: action.payload,
      };

    case "ADD_TASK":
      if (!state.input.trim()) return state;

      return {
        ...state,
        input: "",
        tasks: [
          ...state.tasks,
          {
            id: crypto.randomUUID(),
            title: state.input.trim(),
          },
        ],
      };

    // NEW: Delete Task
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };

    default:
      return state;
  }
}

export default function Home() {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    dispatch({ type: "ADD_TASK" });
  }

  function handleDelete(id: string) {
    dispatch({
      type: "DELETE_TASK",
      payload: id,
    });
  }

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-12">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary p-3 text-primary-foreground">
            <ListTodo size={24} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">Task Manager</h1>
            <p className="text-sm text-muted-foreground">
              Organize your daily work
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Keep track of your tasks</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Total Tasks</p>
              <h2 className="text-3xl font-bold">{state.tasks.length}</h2>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Input
                placeholder="Enter task title..."
                value={state.input}
                onChange={(e) =>
                  dispatch({
                    type: "SET_INPUT",
                    payload: e.target.value,
                  })
                }
              />

              <Button variant="success" type="submit">
                <Plus className="size-4" />
                Add
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Tasks</CardTitle>
            <CardDescription>All your current tasks</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {state.tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between gap-3 rounded-lg border p-4"
              >
                <span className="min-w-0 break-words text-sm font-medium">
                  {task.title}
                </span>

                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant="secondary">Pending</Badge>

                  {/* NEW: Delete Button */}
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(task.id)}
                    aria-label={`Delete ${task.title}`}
                    title="Delete task"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}

            {state.tasks.length === 0 && (
              <p className="py-6 text-center text-muted-foreground">
                No tasks yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
