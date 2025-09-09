import api from "./axios";

export async function getTasks() {
  const { data } = await api.get("/user/tasks");
  return data;
}

export async function getTask(id) {
  const { data } = await api.get(`/user/tasks/${id}`);
  return data;
}

export async function createTask(payload) {
  // payload can include: title (required), description, status, due_date
  const { data } = await api.post("/user/tasks", payload);
  return data;
}

export async function deleteTask(id) {
  await api.delete(`/user/tasks/${id}`);
}

export async function updateTask(id, payload) {
  const { data } = await api.put(`/user/tasks/${id}`, payload);
  return data;
}

export async function updateTaskStatus(id, payload) {
  // payload: { status: 'pending' | 'in-progress' | 'completed', due_date? }
  const { data } = await api.patch(`/user/tasks/${id}/status`, payload);
  return data;
}
