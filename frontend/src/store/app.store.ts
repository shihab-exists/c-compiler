import { create } from "zustand";
import { persist } from "zustand/middleware";

const defaultCode = `// Welcome to C Compiler Pro
#include <stdio.h>

int main() {
    printf("Hello, C Compiler Pro!\\n");
    return 0;
}
`;

interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

interface AppState {
  theme: "light" | "dark";
  toggleTheme: () => void;
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: () => boolean;

  // Editor state
  code: string;
  setCode: (code: string) => void;
  input: string;
  setInput: (input: string) => void;
  output: string;
  errors: string;
  warnings: string;
  executionTime: number;
  memoryUsage: number;
  status: "idle" | "success" | "error" | "warning" | "timeout" | "running";
  setOutput: (payload: Partial<AppState>) => void;

  activeProject: { id: string; name: string } | null;
  setActiveProject: (project: { id: string; name: string } | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      toggleTheme: () => {
        const next = get().theme === "dark" ? "light" : "dark";
        set({ theme: next });
        document.documentElement.classList.toggle("dark", next === "dark");
      },
      user: null,
      setUser: (user) => set({ user }),
      isAuthenticated: () => !!get().user && !!localStorage.getItem("token"),

      code: defaultCode,
      setCode: (code) => set({ code }),
      input: "",
      setInput: (input) => set({ input }),
      output: "",
      errors: "",
      warnings: "",
      executionTime: 0,
      memoryUsage: 0,
      status: "idle",
      setOutput: (payload) => set(payload),

      activeProject: null,
      setActiveProject: (project) => set({ activeProject: project }),
    }),
    { name: "ccompiler-store" }
  )
);

export const snippets = {
  hello: defaultCode,
  arrays: `#include <stdio.h>

int main() {
    int arr[] = {1, 2, 3, 4, 5};
    int n = sizeof(arr) / sizeof(arr[0]);
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");
    return 0;
}
`,
  linkedList: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node* next;
} Node;

int main() {
    Node* head = malloc(sizeof(Node));
    head->data = 42;
    head->next = NULL;
    printf("Node data: %d\\n", head->data);
    free(head);
    return 0;
}
`,
  bubbleSort: `#include <stdio.h>

void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - i - 1; j++)
            if (arr[j] > arr[j + 1]) {
                int t = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = t;
            }
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr) / sizeof(arr[0]);
    bubbleSort(arr, n);
    printf("Sorted array: ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
    return 0;
}
`,
};
