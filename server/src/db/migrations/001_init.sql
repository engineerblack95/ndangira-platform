-- ===== USERS =====
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone         VARCHAR(30),
  role          VARCHAR(20) NOT NULL DEFAULT 'user',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===== ITEMS =====
CREATE TABLE IF NOT EXISTS items (
  id            SERIAL PRIMARY KEY,
  type          VARCHAR(10) NOT NULL CHECK (type IN ('lost','found')),
  title         VARCHAR(200) NOT NULL,
  description   TEXT NOT NULL,
  category      VARCHAR(50) NOT NULL,
  location      VARCHAR(200) NOT NULL,
  date_occurred DATE NOT NULL,
  reward        INTEGER,
  contact_name  VARCHAR(100),
  contact_phone VARCHAR(30),
  contact_email VARCHAR(150),
  status        VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open','resolved','claimed')),
  reporter_id   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===== ITEM IMAGES =====
CREATE TABLE IF NOT EXISTS item_images (
  id       SERIAL PRIMARY KEY,
  item_id  INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  url      TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0
);

-- ===== CLAIMS =====
CREATE TABLE IF NOT EXISTS claims (
  id           SERIAL PRIMARY KEY,
  item_id      INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  claimant_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message      TEXT NOT NULL,
  status       VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===== INDEXES =====
CREATE INDEX IF NOT EXISTS idx_items_type        ON items(type);
CREATE INDEX IF NOT EXISTS idx_items_category    ON items(category);
CREATE INDEX IF NOT EXISTS idx_items_status      ON items(status);
CREATE INDEX IF NOT EXISTS idx_items_reporter    ON items(reporter_id);
CREATE INDEX IF NOT EXISTS idx_item_images_item  ON item_images(item_id);
CREATE INDEX IF NOT EXISTS idx_claims_item       ON claims(item_id);
CREATE INDEX IF NOT EXISTS idx_claims_claimant   ON claims(claimant_id);