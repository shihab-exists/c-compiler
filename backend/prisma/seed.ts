import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const builtinSnippets = [
  {
    title: "Hello World",
    category: "Basics",
    description: "Classic first C program",
    code: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}\n`,
  },
  {
    title: "Arrays",
    category: "Data Structures",
    description: "Iterate over an integer array",
    code: `#include <stdio.h>\n\nint main() {\n    int arr[] = {1, 2, 3, 4, 5};\n    int n = sizeof(arr) / sizeof(arr[0]);\n    for (int i = 0; i < n; i++) {\n        printf("%d ", arr[i]);\n    }\n    printf("\\n");\n    return 0;\n}\n`,
  },
  {
    title: "Linked List",
    category: "Data Structures",
    description: "Simple linked list node",
    code: `#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct Node {\n    int data;\n    struct Node* next;\n} Node;\n\nint main() {\n    Node* head = malloc(sizeof(Node));\n    head->data = 42;\n    head->next = NULL;\n    printf("Node data: %d\\n", head->data);\n    free(head);\n    return 0;\n}\n`,
  },
  {
    title: "Stack",
    category: "Data Structures",
    description: "Array-based stack implementation",
    code: `#include <stdio.h>\n#define MAX 100\nint stack[MAX], top = -1;\nvoid push(int x) { if (top < MAX - 1) stack[++top] = x; }\nint pop() { return top >= 0 ? stack[top--] : -1; }\nint main() { push(10); push(20); printf("Popped: %d\\n", pop()); return 0; }\n`,
  },
  {
    title: "Queue",
    category: "Data Structures",
    description: "Array-based queue implementation",
    code: `#include <stdio.h>\n#define MAX 100\nint queue[MAX], front = -1, rear = -1;\nvoid enqueue(int x) { if (rear < MAX - 1) queue[++rear] = x; if (front == -1) front = 0; }\nint dequeue() { return front != -1 && front <= rear ? queue[front++] : -1; }\nint main() { enqueue(1); enqueue(2); printf("Dequeued: %d\\n", dequeue()); return 0; }\n`,
  },
  {
    title: "Binary Tree",
    category: "Data Structures",
    description: "Simple binary tree node",
    code: `#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct TreeNode {\n    int data;\n    struct TreeNode *left, *right;\n} TreeNode;\n\nint main() {\n    TreeNode* root = malloc(sizeof(TreeNode));\n    root->data = 1; root->left = root->right = NULL;\n    printf("Root: %d\\n", root->data);\n    free(root);\n    return 0;\n}\n`,
  },
  {
    title: "Bubble Sort",
    category: "Sorting",
    description: "Basic bubble sort algorithm",
    code: `#include <stdio.h>\n\nvoid bubbleSort(int arr[], int n) {\n    for (int i = 0; i < n - 1; i++)\n        for (int j = 0; j < n - i - 1; j++)\n            if (arr[j] > arr[j + 1]) {\n                int t = arr[j];\n                arr[j] = arr[j + 1];\n                arr[j + 1] = t;\n            }\n}\n\nint main() {\n    int arr[] = {64, 34, 25, 12, 22, 11, 90};\n    int n = sizeof(arr) / sizeof(arr[0]);\n    bubbleSort(arr, n);\n    printf("Sorted: ");\n    for (int i = 0; i < n; i++) printf("%d ", arr[i]);\n    printf("\\n");\n    return 0;\n}\n`,
  },
  {
    title: "Linear Search",
    category: "Searching",
    description: "Search element in an array",
    code: `#include <stdio.h>\n\nint search(int arr[], int n, int x) {\n    for (int i = 0; i < n; i++)\n        if (arr[i] == x) return i;\n    return -1;\n}\n\nint main() {\n    int arr[] = {10, 20, 30, 40};\n    int x = 30;\n    int idx = search(arr, 4, x);\n    printf(idx != -1 ? "Found at %d\\n" : "Not found\\n", idx);\n    return 0;\n}\n`,
  },
];

async function main() {
  for (const s of builtinSnippets) {
    await prisma.snippet.upsert({
      where: { title: s.title },
      update: {},
      create: { ...s, isBuiltin: true },
    });
  }
  console.log("✅ Built-in snippets seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
