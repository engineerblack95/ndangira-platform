// ⭐ Swap point: currently mocks items + real auth against the backend.
// When you build item endpoints on the server later, replace the mock item
// functions with fetch calls to `${API_URL}/items`.

import { mockLostItems, mockFoundItems } from "../data/mockData";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ==================== ITEMS (still mock) ====================

export async function getItems({ type = "lost", search = "", category = "All" } = {}) {
  await delay(200);
  let items = type === "lost" ? [...mockLostItems] : [...mockFoundItems];

  if (search) {
    const q = search.toLowerCase();
    items = items.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q)
    );
  }
  if (category && category !== "All") {
    items = items.filter((i) => i.category === category);
  }
  return items;
}

export async function getItemById(id) {
  await delay(150);
  const all = [...mockLostItems, ...mockFoundItems];
  return all.find((i) => i._id === id) || null;
}

export async function createItem(data) {
  await delay(300);
  return {
    ...data,
    _id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    status: "open",
  };
}

// ==================== AUTH (real backend) ====================

export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Login failed");
  return data; // { user, token }
}

export async function register(name, email, password, phone = "") {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, phone }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Registration failed");
  return data; // { user, token }
}

export async function getMe(token) {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Failed to fetch user");
  return data; // { user }
}