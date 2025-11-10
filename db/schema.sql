-- Create tables
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    par INT NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    image_url TEXT,
    category TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS room_groups (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    number INT NOT NULL,
    group_name TEXT,
    group_id INT REFERENCES room_groups(id),
    UNIQUE(number, group_id)
);

-- Make group_name nullable if it exists and is NOT NULL
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='rooms' AND column_name='group_name' AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE rooms ALTER COLUMN group_name DROP NOT NULL;
    END IF;
END $$;

-- Add group_id column to existing rooms table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='rooms' AND column_name='group_id'
    ) THEN
        ALTER TABLE rooms ADD COLUMN group_id INT REFERENCES room_groups(id);
        
        -- Migrate existing data from group_name to group_id
        UPDATE rooms SET group_id = (
            CASE
                WHEN group_name = 'Casa 1' THEN (SELECT id FROM room_groups WHERE name = 'Casa 1' LIMIT 1)
                WHEN group_name = 'Casa 2' THEN (SELECT id FROM room_groups WHERE name = 'Casa 2' LIMIT 1)
                ELSE NULL
            END
        ) WHERE group_id IS NULL;
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY,
    room_id INT REFERENCES rooms(id),
    product_id INT REFERENCES products(id),
    quantity INT NOT NULL
);

CREATE TABLE IF NOT EXISTS submissions (
    id SERIAL PRIMARY KEY,
    room_id INT REFERENCES rooms(id),
    user_id INT REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS submission_items (
    id SERIAL PRIMARY KEY,
    submission_id INT REFERENCES submissions(id),
    product_id INT REFERENCES products(id),
    consumed_quantity INT NOT NULL
);

-- Insert placeholder data (only if not already present)
INSERT INTO products (name, par, price, image_url, category)
SELECT 'Sparkling Water', 4, 3.50, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmoXkMo5Ner2TrL0ETQBP1E6aIVGoYMEl2bFzo_azt3mDb0dre9nRh8aq8ltOkQllUQ5haNvZUjtOVH3pZ5NAc4A6pHnJueoC4Nbe6k-fdcH5t8oucZfYNCtn-IWvYY6LAnrw8OkYQVqjOizBhSOqNALo-v-pb6Ub4xBT80WNa8HM0ZSO8NHP58myIRzQmgJDF3G-MHHU3ILw4rhAuFWINXklBPKdN-hHqftpgFPv89u9_L21C65pNLwdqd_hQOaBTOJ1pyGBvwkA', 'Drinks'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sparkling Water');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Chocolate Bar', 6, 2.75, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDUH8QH0zr3Z_JzPybRAbrnRJRDeQh8gqFijnZYTKAVEH1CnQItse9iUiJaEhLRUHICURqYJacXIWg_ixpRU5kYScioQ2axhh9fjmfRtJk9-oqCqtzKdhi_8crV19gvL4Ui2nGVYOS2GaFt6L0fV2KNgHr25iHETYsUljenFj32RWH32l4mvE8Jkdk7KhUF8ljnmL5aQCiuOt9_sLunEuiFXhDnUGk4cibD4NNfYj-YscNW4_bPo0TDcmC54q2AyjDuxrxgu0SKQY', 'Snacks'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Chocolate Bar');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Shampoo', 2, 8.25, 'https://lh3.googleusercontent.com/aida-public/AB6AXuADdt37ik6aEox2iXLxlpzsdFnyjQTEVbJvnGynQ0995XPthRdC3KSywQvjT1IRGhB0wXYCAjpPYXenSz2twZ4xPfBqhHIMZBSzoyURlES7qosEdXb7CqRuheCRTrk2TtETyjYTgrdtKNIZxiXB2ucm3UL1nDJgO8m_FwIjBzUzO-x9IQ1lGJ-m-cCTlYW_G9wUXvBGQip0mTQjluHQatg0UzHxDexJVqk9SPdxVo9C7QoQZL2a_nC-gSQYXc237uQv3IGYQF0Tzxk', 'Amenities'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Shampoo');

-- Insert room groups first (only if not already present)
INSERT INTO room_groups (name)
SELECT 'Casa 1' WHERE NOT EXISTS (SELECT 1 FROM room_groups WHERE name = 'Casa 1');

INSERT INTO room_groups (name)
SELECT 'Casa 2' WHERE NOT EXISTS (SELECT 1 FROM room_groups WHERE name = 'Casa 2');

-- Then insert rooms with references to room groups (only if not already present)
INSERT INTO rooms (number, group_name, group_id)
SELECT 101, 'Casa 1', (SELECT id FROM room_groups WHERE name = 'Casa 1')
WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE number = 101);

INSERT INTO rooms (number, group_name, group_id)
SELECT 102, 'Casa 1', (SELECT id FROM room_groups WHERE name = 'Casa 1')
WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE number = 102);

INSERT INTO rooms (number, group_name, group_id)
SELECT 103, 'Casa 1', (SELECT id FROM room_groups WHERE name = 'Casa 1')
WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE number = 103);

INSERT INTO rooms (number, group_name, group_id)
SELECT 201, 'Casa 2', (SELECT id FROM room_groups WHERE name = 'Casa 2')
WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE number = 201);

INSERT INTO rooms (number, group_name, group_id)
SELECT 202, 'Casa 2', (SELECT id FROM room_groups WHERE name = 'Casa 2')
WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE number = 202);

-- Update any existing rooms that have group_name but no group_id
UPDATE rooms SET group_id = (
    CASE
        WHEN group_name = 'Casa 1' THEN (SELECT id FROM room_groups WHERE name = 'Casa 1' LIMIT 1)
        WHEN group_name = 'Casa 2' THEN (SELECT id FROM room_groups WHERE name = 'Casa 2' LIMIT 1)
        ELSE NULL
    END
) WHERE group_id IS NULL AND group_name IS NOT NULL;

-- Insert sample users (passwords are plain text for local use) - only if not already present
INSERT INTO users (username, password)
SELECT 'admin', 'admin123' WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');

INSERT INTO users (username, password)
SELECT 'manager', 'manager123' WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'manager');

INSERT INTO users (username, password)
SELECT 'staff', 'staff123' WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'staff');

-- Insert products from raw_data.json
INSERT INTO products (name, par, price, image_url, category)
SELECT 'Rain Forest still water', 2, 0.00, NULL, 'Beverages'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Rain Forest still water');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'San Pellegrino sparkling water', 2, 0.00, NULL, 'Beverages'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'San Pellegrino sparkling water');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'San Pellegrino Aranciata', 1, 0.00, NULL, 'Beverages'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'San Pellegrino Aranciata');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'San Pellegrino Limonatta', 1, 0.00, NULL, 'Beverages'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'San Pellegrino Limonatta');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Coca Cola Regular', 2, 0.00, NULL, 'Beverages'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Coca Cola Regular');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Red Bull', 1, 0.00, NULL, 'Beverages'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Red Bull');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Sprite', 1, 0.00, NULL, 'Beverages'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sprite');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Fanta', 1, 0.00, NULL, 'Beverages'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Fanta');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Agua Fever Tree Mediterranean Tonic', 1, 0.00, NULL, 'Beverages'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Agua Fever Tree Mediterranean Tonic');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Agua Fever Tree Premium Indian', 1, 0.00, NULL, 'Beverages'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Agua Fever Tree Premium Indian');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Otro, Golden Berry sparkling seltzer', 1, 0.00, NULL, 'Beverages'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Otro, Golden Berry sparkling seltzer');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Zarpezul - Premium Lager (American Style)', 1, 0.00, NULL, 'Beer & Wine'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Zarpezul - Premium Lager (American Style)');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Corona Extra', 1, 0.00, NULL, 'Beer & Wine'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Corona Extra');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Duckhorn Sauvignon Blanc, Napa Valley, USA', 1, 0.00, NULL, 'Beer & Wine'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Duckhorn Sauvignon Blanc, Napa Valley, USA');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Chianti Ruffino DOCG', 1, 0.00, NULL, 'Beer & Wine'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Chianti Ruffino DOCG');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Moët & Chandon Brut Impérial, Champagne', 1, 0.00, NULL, 'Beer & Wine'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Moët & Chandon Brut Impérial, Champagne');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Moët & Chandon Brut Impérial Rosé, Champagne', 1, 0.00, NULL, 'Beer & Wine'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Moët & Chandon Brut Impérial Rosé, Champagne');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Flor de Caña 12 rum', 1, 0.00, NULL, 'Liquors'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Flor de Caña 12 rum');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Grey Goose vodka', 1, 0.00, NULL, 'Liquors'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Grey Goose vodka');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Tito''s vodka', 1, 0.00, NULL, 'Liquors'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Tito''s vodka');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Herradura tequila', 1, 0.00, NULL, 'Liquors'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Herradura tequila');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Jack Daniel''s whiskey', 1, 0.00, NULL, 'Liquors'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Jack Daniel''s whiskey');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Glenmorangie 10 whisky', 1, 0.00, NULL, 'Liquors'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Glenmorangie 10 whisky');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Café cold brew, Verolls', 1, 0.00, NULL, 'Liquors'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Café cold brew, Verolls');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'M&M''s', 1, 0.00, NULL, 'Snacks'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'M&M''s');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Chocolate Kit Kat', 1, 0.00, NULL, 'Snacks'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Chocolate Kit Kat');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Chocolate Cranberry Granuts', 1, 0.00, NULL, 'Snacks'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Chocolate Cranberry Granuts');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Chocolate Toasted Almonds Granuts', 1, 0.00, NULL, 'Snacks'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Chocolate Toasted Almonds Granuts');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Natural Bites Omega SuperMix', 1, 0.00, NULL, 'Snacks'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Natural Bites Omega SuperMix');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Dark Chocolate bar with almonds Nahua', 1, 0.00, NULL, 'Snacks'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Dark Chocolate bar with almonds Nahua');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Dark Chocolate bar with orange Nahua', 1, 0.00, NULL, 'Snacks'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Dark Chocolate bar with orange Nahua');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Platanitos Chip', 1, 0.00, NULL, 'Snacks'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Platanitos Chip');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Yuquitas Tomate Chip', 1, 0.00, NULL, 'Snacks'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Yuquitas Tomate Chip');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Cricket Protein Peanut butter', 1, 0.00, NULL, 'Snacks'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Cricket Protein Peanut butter');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Nature Valley Granola Bar', 1, 0.00, NULL, 'Snacks'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Nature Valley Granola Bar');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Potato Chips', 1, 0.00, NULL, 'Snacks'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Potato Chips');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Jungle Cookies', 1, 0.00, NULL, 'Snacks'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Jungle Cookies');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Sea Salt Popcorn', 1, 0.00, NULL, 'Snacks'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sea Salt Popcorn');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Café Britt Intenso', 4, 0.00, NULL, 'Set Coffee & Tea'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Café Britt Intenso');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Café Britt Montecielo', 2, 0.00, NULL, 'Set Coffee & Tea'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Café Britt Montecielo');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Te Manza Te Negro', 2, 0.00, NULL, 'Set Coffee & Tea'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Te Manza Te Negro');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Te Manza Te Verde', 2, 0.00, NULL, 'Set Coffee & Tea'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Te Manza Te Verde');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Te Manza Te Manzanilla', 2, 0.00, NULL, 'Set Coffee & Tea'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Te Manza Te Manzanilla');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Azucar Splenda', 6, 0.00, NULL, 'Set Coffee & Tea'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Azucar Splenda');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Azucar Regular', 6, 0.00, NULL, 'Set Coffee & Tea'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Azucar Regular');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Azucar Moreno', 6, 0.00, NULL, 'Set Coffee & Tea'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Azucar Moreno');

INSERT INTO products (name, par, price, image_url, category)
SELECT 'Crema', 6, 0.00, NULL, 'Set Coffee & Tea'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Crema');

-- Insert inventory records (only for new room-product combinations)
INSERT INTO inventory (room_id, product_id, quantity)
SELECT r.id, p.id, p.par
FROM rooms r, products p
WHERE NOT EXISTS (
    SELECT 1 FROM inventory i
    WHERE i.room_id = r.id AND i.product_id = p.id
);
