-- Usuarios de la aplicación
CREATE TABLE users (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  display_name  TEXT NOT NULL,
  timezone      TEXT NOT NULL DEFAULT 'America/Bogota',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Catálogo de hábitos que ofrece la app (tender la cama, etc.)
CREATE TABLE habit_templates (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  description TEXT,
  category    TEXT NOT NULL
);

-- Hábitos que cada usuario eligió y configuró
CREATE TABLE habits (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id       BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  template_id   BIGINT REFERENCES habit_templates(id) ON DELETE SET NULL,
  name          TEXT NOT NULL,
  deadline_time TIME,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_habits_user_id ON habits(user_id);

-- Un registro por hábito por día
CREATE TABLE check_ins (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  habit_id   BIGINT NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  check_date DATE NOT NULL,
  status     TEXT NOT NULL CHECK (status IN ('done', 'skipped', 'missed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (habit_id, check_date)
);