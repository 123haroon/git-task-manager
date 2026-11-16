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
import { Plus, ListTodo, Trash2, Pencil, Check, X } from "lucide-react";

// -----------------------------
// TYPES
// -----------------------------

type Task = {
  id: string;
  title: string;
};

type TaskState = {
  input: string;
  tasks: Task[];
  editingId: string | null;
  editInput: string;
};

type TaskAction =
  | { type: "SET_INPUT"; payload: string }
  | { type: "ADD_TASK" }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "START_EDIT"; payload: Task }
  | { type: "SET_EDIT_INPUT"; payload: string }
  | { type: "CANCEL_EDIT" }
  | { type: "UPDATE_TASK" };

// -----------------------------
// INITIAL STATE
// -----------------------------

const initialState: TaskState = {
  input: "",
  tasks: [
    { id: "1", title: "Setup Next.js project" },
    { id: "2", title: "Learn Git and GitHub" },
  ],
  editingId: null,
  editInput: "",
};

// -----------------------------
// REDUCER
// -----------------------------

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

    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
        editingId: state.editingId === action.payload ? null : state.editingId,
        editInput: state.editingId === action.payload ? "" : state.editInput,
      };

    case "START_EDIT":
      return {
        ...state,
        editingId: action.payload.id,
        editInput: action.payload.title,
      };

    case "SET_EDIT_INPUT":
      return {
        ...state,
        editInput: action.payload,
      };

    case "CANCEL_EDIT":
      return {
        ...state,
        editingId: null,
        editInput: "",
      };

    case "UPDATE_TASK": {
      if (!state.editingId || !state.editInput.trim()) {
        return state;
      }

      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === state.editingId
            ? {
                ...task,
                title: state.editInput.trim(),
              }
            : task,
        ),
        editingId: null,
        editInput: "",
      };
    }

    default:
      return state;
  }
}

// -----------------------------
// MAIN COMPONENT
// -----------------------------

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

  function handleEdit(task: Task) {
    dispatch({
      type: "START_EDIT",
      payload: task,
    });
  }

  function handleSave() {
    dispatch({ type: "UPDATE_TASK" });
  }

  function handleCancel() {
    dispatch({ type: "CANCEL_EDIT" });
  }

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-12">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* HEADER */}
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

        {/* OVERVIEW */}
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

        {/* ADD TASK */}
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

              <Button
                variant="success"
                type="submit"
                disabled={!state.input.trim()}
              >
                <Plus className="size-4" />
                Add
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* TASK LIST */}
        <Card>
          <CardHeader>
            <CardTitle>Your Tasks</CardTitle>
            <CardDescription>All your current tasks</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {state.tasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                {state.editingId === task.id ? (
                  /* EDIT MODE */
                  <form
                    className="flex w-full flex-col gap-2 sm:flex-row"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSave();
                    }}
                  >
                    <Input
                      className="min-w-0 flex-1"
                      value={state.editInput}
                      autoFocus
                      onChange={(e) =>
                        dispatch({
                          type: "SET_EDIT_INPUT",
                          payload: e.target.value,
                        })
                      }
                    />

                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        variant="success"
                        size="sm"
                        disabled={!state.editInput.trim()}
                      >
                        <Check className="size-4" />
                        Save
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                      >
                        <X className="size-4" />
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  /* NORMAL TASK MODE */
                  <>
                    <span className="min-w-0 break-words text-sm font-medium">
                      {task.title}
                    </span>

                    <div className="flex shrink-0 items-center gap-2">
                      <Badge variant="secondary">Pending</Badge>

                      {/* EDIT BUTTON */}
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(task)}
                        aria-label={`Edit ${task.title}`}
                        title="Edit task"
                      >
                        <Pencil className="size-4" />
                      </Button>

                      {/* DELETE BUTTON */}
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
                  </>
                )}
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
