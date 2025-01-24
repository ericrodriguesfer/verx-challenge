CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.producer (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT uuid_generate_v4(),
    cpr_or_cnpj VARCHAR(18) NOT NULL,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.harvest (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT uuid_generate_v4(),
    name VARCHAR(15) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.rural_propertie (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT uuid_generate_v4(),
    name VARCHAR(30) NOT NULL,
    city VARCHAR(30) NOT NULL,
    state VARCHAR(30) NOT NULL,
    total_area_farm DECIMAL(20, 2) NOT NULL,
    arable_area DECIMAL(20, 2) NOT NULL,
    vegetation_area DECIMAL(20, 2) NOT NULL,
    harvest_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,

    CONSTRAINT fk_harvest FOREIGN KEY (harvest_id) REFERENCES harvest (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.crop (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT uuid_generate_v4(),
    name VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.crops_planted (
    id SERIAL PRIMARY KEY,
    rural_propertie_id INT NOT NULL,
    crop_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,

    CONSTRAINT fk_rural_propertie FOREIGN KEY (rural_propertie_id) REFERENCES rural_propertie (id) ON DELETE CASCADE,
    CONSTRAINT fk_crop FOREIGN KEY (crop_id) REFERENCES crop (id) ON DELETE CASCADE
);

INSERT INTO public.harvest (uuid, name, created_at, updated_at)
VALUES
    (uuid_generate_v4(), 'Safra 2024', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (uuid_generate_v4(), 'Safra 2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO public.crop (uuid, name, created_at, updated_at)
VALUES
    (uuid_generate_v4(), 'Milho Safra 2024', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (uuid_generate_v4(), 'Soja Safra 2024', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (uuid_generate_v4(), 'Milho Safra 2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (uuid_generate_v4(), 'Soja Safra 2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (uuid_generate_v4(), 'Arros Safra 2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
