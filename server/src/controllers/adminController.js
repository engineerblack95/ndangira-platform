import { query } from "../config/db.js";

// ===== GET /api/admin/stats =====
export async function getStats(req, res, next) {
  try {
    const [users, lost, found, claims, resolved] = await Promise.all([
      query("SELECT COUNT(*)::int AS c FROM users"),
      query("SELECT COUNT(*)::int AS c FROM items WHERE type='lost'"),
      query("SELECT COUNT(*)::int AS c FROM items WHERE type='found'"),
      query("SELECT COUNT(*)::int AS c FROM claims"),
      query("SELECT COUNT(*)::int AS c FROM items WHERE status='resolved'"),
    ]);

    res.json({
      users: users.rows[0].c,
      lostItems: lost.rows[0].c,
      foundItems: found.rows[0].c,
      claims: claims.rows[0].c,
      resolved: resolved.rows[0].c,
    });
  } catch (err) {
    next(err);
  }
}

// ===== GET /api/admin/users?search= =====
export async function listUsers(req, res, next) {
  try {
    const { search } = req.query;
    const params = [];
    let where = "";

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      where = `WHERE LOWER(name) LIKE $1 OR LOWER(email) LIKE $1`;
    }

    const result = await query(
      `SELECT id, name, email, phone, role, created_at
       FROM users
       ${where}
       ORDER BY created_at DESC`,
      params
    );

    res.json({ users: result.rows });
  } catch (err) {
    next(err);
  }
}

// ===== PATCH /api/admin/users/:id/role =====
export async function updateUserRole(req, res, next) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ error: "role must be 'user' or 'admin'" });
    }

    // Prevent admin from demoting themselves
    if (Number(id) === req.user.id && role !== "admin") {
      return res.status(400).json({ error: "You cannot change your own admin role" });
    }

    const result = await query(
      "UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role",
      [role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// ===== DELETE /api/admin/users/:id =====
export async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;

    if (Number(id) === req.user.id) {
      return res.status(400).json({ error: "You cannot delete your own account" });
    }

    const result = await query("DELETE FROM users WHERE id = $1 RETURNING id", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ ok: true, deletedId: result.rows[0].id });
  } catch (err) {
    next(err);
  }
}

// ===== GET /api/admin/items?type=&status=&search= =====
export async function listAllItems(req, res, next) {
  try {
    const { type, status, search } = req.query;

    const conditions = [];
    const params = [];

    if (type === "lost" || type === "found") {
      params.push(type);
      conditions.push(`i.type = $${params.length}`);
    }
    if (status && ["open", "resolved", "claimed"].includes(status)) {
      params.push(status);
      conditions.push(`i.status = $${params.length}`);
    }
    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      conditions.push(
        `(LOWER(i.title) LIKE $${params.length} OR LOWER(i.location) LIKE $${params.length})`
      );
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const result = await query(
      `SELECT i.*,
              u.name AS reporter_name,
              u.email AS reporter_email,
              COALESCE(
                json_agg(ii.url ORDER BY ii.position) FILTER (WHERE ii.id IS NOT NULL),
                '[]'
              ) AS images
       FROM items i
       LEFT JOIN users u ON u.id = i.reporter_id
       LEFT JOIN item_images ii ON ii.item_id = i.id
       ${where}
       GROUP BY i.id, u.name, u.email
       ORDER BY i.created_at DESC`,
      params
    );

    res.json({ items: result.rows });
  } catch (err) {
    next(err);
  }
}

// ===== PATCH /api/admin/items/:id/status =====
export async function updateItemStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["open", "resolved", "claimed"].includes(status)) {
      return res.status(400).json({ error: "invalid status" });
    }

    const result = await query(
      `UPDATE items SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, title, status`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json({ item: result.rows[0] });
  } catch (err) {
    next(err);
  }
}