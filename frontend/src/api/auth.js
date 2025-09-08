import api from "./axios";

export async function login(email, password) {
  const { data } = await api.post("/login", { email, password });
  if (data?.token) {
    localStorage.setItem("token", data.token);
  }
  return data;
}

export async function register(formData) {
  const { data } = await api.post("/register", {
    name: formData.name,
    email: formData.email,
    password: formData.password,
    password_confirmation: formData.password_confirmation,
  });
  if (data?.token) {
    localStorage.setItem("token", data.token);
  }
  return data;
}

export async function logout() {
  try {
    await api.post("/logout");
  } finally {
    localStorage.removeItem("token");
    // Force page reload to clear state and redirect to login
    window.location.reload();
  }
}
