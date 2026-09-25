const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ==================== ITEMS ====================

export async function getItems({ type = "lost", search = "", category = "All" } = {}) {
  const params = new URLSearchParams();
  if (type) params.set("type", type);
  if (search) params.set("search", search);
  if (category && category !== "All") params.set("category", category);

  const res = await fetch(`${API_URL}/items?${params.toString()}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Failed to load items");
  return data.items || [];
}

export async function getItemById(id) {
  const res = await fetch(`${API_URL}/items/${id}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Item not found");
  return data.item || null;
}

/**
 * createItem supports optional file uploads.
 * @param {Object} payload Fields: type, title, description, category, location, date_occurred, reward, contact_name, contact_phone, contact_email
 * @param {File[]} files  Optional array of File objects from <input type="file" multiple>
 */
export async function createItem(payload, files = []) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  files.forEach((file) => {
    formData.append("images", file);
  });

  const res = await fetch(`${API_URL}/items`, {
    method: "POST",
    body: formData, // NOTE: no Content-Type header — the browser sets multipart boundary
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Failed to create item");
  return data.item;
}

// ==================== AUTH ====================

export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Login failed");
  return data;
}

export async function register(name, email, password, phone = "") {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, phone }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Registration failed");
  return data;
}

export async function getMe(token) {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Failed to fetch user");
  return data;
}