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
