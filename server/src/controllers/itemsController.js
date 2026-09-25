import { query } from "../config/db.js";

// ===== GET /api/items?type=lost&search=&category= =====
export async function listItems(req, res, next) {
  try {
    const { type, search, category } = req.query;

    const conditions = [];
    const params = [];

    if (type === "lost" || type === "found") {
      params.push(type);
      conditions.push(`i.type = $${params.length}`);
    }

    if (category && category !== "All") {
      params.push(category);
      conditions.push(`i.category = $${params.length}`);
    }

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      conditions.push(
        `(LOWER(i.title) LIKE $${params.length} OR LOWER(i.description) LIKE $${params.length} OR LOWER(i.location) LIKE $${params.length})`
      );
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const result = await query(
      `SELECT i.*,
              COALESCE(
                json_agg(ii.url ORDER BY ii.position) FILTER (WHERE ii.id IS NOT NULL),
                '[]'
              ) AS images
       FROM items i
       LEFT JOIN item_images ii ON ii.item_id = i.id
       ${where}
       GROUP BY i.id
       ORDER BY i.created_at DESC`,
      params
    );

    res.json({ items: result.rows });
  } catch (err) {
    next(err);
  }
}

// ===== GET /api/items/:id =====
export async function getItem(req, res, next) {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT i.*,
              COALESCE(
                json_agg(ii.url ORDER BY ii.position) FILTER (WHERE ii.id IS NOT NULL),
                '[]'
              ) AS images
       FROM items i
       LEFT JOIN item_images ii ON ii.item_id = i.id
       WHERE i.id = $1
       GROUP BY i.id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json({ item: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// ===== POST /api/items =====
export async function createItem(req, res, next) {
  try {
    const {
      type,
      title,
      description,
      category,
      location,
      date_occurred,
      reward,
      contact_name,
      contact_phone,
      contact_email,
    } = req.body;

    if (!type || !["lost", "found"].includes(type)) {
      return res.status(400).json({ error: "type must be 'lost' or 'found'" });
    }
    if (!title || !description || !category || !location) {
      return res
        .status(400)
        .json({ error: "title, description, category and location are required" });
    }

    const reporterId = req.user?.id || null;

    const result = await query(
      `INSERT INTO items
        (type, title, description, category, location, date_occurred, reward,
         contact_name, contact_phone, contact_email, reporter_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [
        type,
        title,
        description,
        category,
        location,
        date_occurred || new Date().toISOString().slice(0, 10),
        reward ? Number(reward) : null,
        contact_name || null,
        contact_phone || null,
        contact_email || null,
        reporterId,
      ]
    );

    const item = result.rows[0];

    // Save image URLs if any files were uploaded
    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(
        (f) => `http://localhost:5000/uploads/${f.filename}`
      );

      for (let i = 0; i < imageUrls.length; i++) {
        await query(
          "INSERT INTO item_images (item_id, url, position) VALUES ($1, $2, $3)",
          [item.id, imageUrls[i], i]
        );
      }

      item.images = imageUrls;
    } else {
      item.images = [];
    }

    res.status(201).json({ item });
  } catch (err) {
    next(err);
  }
}

// ===== DELETE /api/items/:id =====
export async function deleteItem(req, res, next) {
  try {
    const { id } = req.params;
    const result = await query("DELETE FROM items WHERE id = $1 RETURNING id", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json({ ok: true, deletedId: result.rows[0].id });
  } catch (err) {
    next(err);
  }
}