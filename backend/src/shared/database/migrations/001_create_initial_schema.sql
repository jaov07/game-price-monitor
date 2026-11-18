-- O QUE ISSO FAZ:
-- Cria a estrutura inicial das tabelas do GamePrice Monitor:
-- stores, games, game_stores e price_history, com constraints e índices.

-- 1. Tabela de lojas suportadas (Steam, etc.)
CREATE TABLE IF NOT EXISTS stores (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    base_url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Tabela canônica de jogos
CREATE TABLE IF NOT EXISTS games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índice para buscas rápidas por slug
CREATE INDEX IF NOT EXISTS idx_games_slug ON games (slug);

-- 3. Tabela associativa entre jogos e lojas (mapeando o ID externo, como o AppID da Steam)
CREATE TABLE IF NOT EXISTS game_stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    store_id VARCHAR(50) NOT NULL REFERENCES stores(id) ON DELETE RESTRICT,
    external_id VARCHAR(100) NOT NULL,
    store_url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_game_stores_store_external UNIQUE (store_id, external_id),
    CONSTRAINT uq_game_stores_game_store UNIQUE (game_id, store_id)
);

-- 4. Tabela de histórico de preços (imutável e acumulativa)
CREATE TABLE IF NOT EXISTS price_history (
    id BIGSERIAL PRIMARY KEY,
    game_store_id UUID NOT NULL REFERENCES game_stores(id) ON DELETE CASCADE,
    currency VARCHAR(3) NOT NULL DEFAULT 'BRL',
    initial_price NUMERIC(10, 2) NOT NULL,
    final_price NUMERIC(10, 2) NOT NULL,
    discount_percent INTEGER NOT NULL DEFAULT 0,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índice composto para consultas rápidas do preço atual e histórico
CREATE INDEX IF NOT EXISTS idx_price_history_lookup ON price_history (game_store_id, recorded_at DESC);

-- Seed da loja Steam como primeira parceira do sistema
INSERT INTO stores (id, name, base_url)
VALUES ('steam', 'Steam', 'https://store.steampowered.com')
ON CONFLICT (id) DO NOTHING;
