import api from "./axios";

export async function getTasks() {
  const { data } = await api.get("/tasks");
  return data;
}

export async function getTask(id) {
  const { data } = await api.get(`/tasks/${id}`);
  return data;
}

export async function createTask(payload) {
  // payload can include: title (required), description, status, due_date
  const { data } = await api.post("/tasks", payload);
  return data;
}

export async function deleteTask(id) {
  await api.delete(`/tasks/${id}`);
}

export async function updateTask(id, payload) {
  const { data } = await api.put(`/tasks/${id}`, payload);
  return data;
}
