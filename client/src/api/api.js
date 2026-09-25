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
    body: formData,
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

// ==================== ADMIN ====================

function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

export async function adminGetStats(token) {
  const res = await fetch(`${API_URL}/admin/stats`, {
    headers: authHeader(token),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Failed to load stats");
  return data;
}

export async function adminListUsers(token, search = "") {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  const res = await fetch(`${API_URL}/admin/users?${params}`, {
    headers: authHeader(token),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Failed to load users");
  return data.users || [];
}

export async function adminUpdateUserRole(token, userId, role) {
  const res = await fetch(`${API_URL}/admin/users/${userId}/role`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeader(token) },
    body: JSON.stringify({ role }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Failed to update role");
  return data.user;
}

export async function adminDeleteUser(token, userId) {
  const res = await fetch(`${API_URL}/admin/users/${userId}`, {
    method: "DELETE",
    headers: authHeader(token),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Failed to delete user");
  return data;
}

export async function adminListItems(token, { type, status, search } = {}) {
  const params = new URLSearchParams();
  if (type) params.set("type", type);
  if (status) params.set("status", status);
  if (search) params.set("search", search);
  const res = await fetch(`${API_URL}/admin/items?${params}`, {
    headers: authHeader(token),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Failed to load items");
  return data.items || [];
}

export async function adminUpdateItemStatus(token, itemId, status) {
  const res = await fetch(`${API_URL}/admin/items/${itemId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeader(token) },
    body: JSON.stringify({ status }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Failed to update status");
  return data.item;
}