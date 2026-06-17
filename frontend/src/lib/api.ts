import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

export const authApi = {
  login: (email: string, password: string) => API.post("/auth/login", { email, password }),
  register: (email: string, password: string, name?: string) =>
    API.post("/auth/register", { email, password, name }),
  google: (data: any) => API.post("/auth/google", data),
  me: () => API.get("/auth/me"),
};

export const compilerApi = {
  run: (code: string, input?: string, projectId?: string) =>
    API.post("/compiler/run", { code, input, projectId }),
  compile: (code: string, input?: string, projectId?: string) =>
    API.post("/compiler/compile", { code, input, projectId }),
};

export const projectApi = {
  list: () => API.get("/projects"),
  get: (id: string) => API.get(`/projects/${id}`),
  create: (data: any) => API.post("/projects", data),
  update: (id: string, data: any) => API.put(`/projects/${id}`, data),
  delete: (id: string) => API.delete(`/projects/${id}`),
  duplicate: (id: string) => API.post(`/projects/${id}/duplicate`),
};

export const snippetApi = {
  list: () => API.get("/snippets"),
  create: (data: any) => API.post("/snippets", data),
  use: (id: string) => API.post(`/snippets/${id}/use`),
};

export const aiApi = {
  explain: (code: string) => API.post("/ai/explain", { code }),
  errorAnalysis: (error: string) => API.post("/ai/error-analysis", { error }),
  complexity: (code: string) => API.post("/ai/complexity", { code }),
};

export const analyticsApi = {
  get: () => API.get("/analytics"),
};
