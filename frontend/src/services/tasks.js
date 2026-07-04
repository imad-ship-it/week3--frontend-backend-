// src/services/tasks.js
import api from "./api";

export async function getTasks() {
  const { data } = await api.get("/tasks/");
  return data;
}

export async function createTask(payload) {
  const { data } = await api.post("/tasks/", payload);
  return data;
}

export async function updateTask(id, payload) {
  const { data } = await api.patch(`/tasks/${id}/`, payload);
  return data;
}

export async function deleteTask(id) {
  await api.delete(`/tasks/${id}/`);
}
