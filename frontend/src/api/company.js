import api from "./axios";

// Company task management
export async function getCompanyTasks() {
  const { data } = await api.get("/company/tasks");
  return data;
}

export async function createCompanyTask(taskData) {
  const { data } = await api.post("/company/tasks", taskData);
  return data;
}

export async function updateCompanyTask(id, taskData) {
  const { data } = await api.put(`/company/tasks/${id}`, taskData);
  return data;
}

export async function deleteCompanyTask(id) {
  const { data } = await api.delete(`/company/tasks/${id}`);
  return data;
}

export async function getCompanyUsers() {
  const { data } = await api.get("/company/users");
  return data;
}

// User management
export async function getCompanyUserList() {
  const { data } = await api.get("/company/users");
  return data;
}

export async function createCompanyUser(userData) {
  const { data } = await api.post("/company/users", userData);
  return data;
}

export async function updateCompanyUser(id, userData) {
  const { data } = await api.put(`/company/users/${id}`, userData);
  return data;
}

export async function deleteCompanyUser(id) {
  const { data } = await api.delete(`/company/users/${id}`);
  return data;
}
