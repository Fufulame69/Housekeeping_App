-- Create tables
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    par INT NOT NULL,
    image_url TEXT,
    category TEXT NOT NULL
);

CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    number INT NOT NULL,
    group_name TEXT NOT NULL
);

CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    room_id INT REFERENCES rooms(id),
    product_id INT REFERENCES products(id),
    quantity INT NOT NULL
);

CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    room_id INT REFERENCES rooms(id),
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE submission_items (
    id SERIAL PRIMARY KEY,
    submission_id INT REFERENCES submissions(id),
    product_id INT REFERENCES products(id),
    consumed_quantity INT NOT NULL
);

-- Insert placeholder data
INSERT INTO products (name, par, image_url, category) VALUES
('Sparkling Water', 4, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmoXkMo5Ner2TrL0ETQBP1E6aIVGoYMEl2bFzo_azt3mDb0dre9nRh8aq8ltOkQllUQ5haNvZUjtOVH3pZ5NAc4A6pHnJueoC4Nbe6k-fdcH5t8oucZfYNCtn-IWvYY6LAnrw8OkYQVqjOizBhSOqNALo-v-pb6Ub4xBT80WNa8HM0ZSO8NHP58myIRzQmgJDF3G-MHHU3ILw4rhAuFWINXklBPKdN-hHqftpgFPv89u9_L21C65pNLwdqd_hQOaBTOJ1pyGBvwkA', 'Drinks'),
('Chocolate Bar', 6, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDUH8QH0zr3Z_JzPybRAbrnRJRDeQh8gqFijnZYTKAVEH1CnQItse9iUiJaEhLRUHICURqYJacXIWg_ixpRU5kYScioQ2axhh9fjmfRtJk9-oqCqtzKdhi_8crV19gvL4Ui2nGVYOS2GaFt6L0fV2KNgHr25iHETYsUljenFj32RWH32l4mvE8Jkdk7KhUF8ljnmL5aQCiuOt9_sLunEuiFXhDnUGk4cibD4NNfYj-YscNW4_bPo0TDcmC54q2AyjDuxrxgu0SKQY', 'Snacks'),
('Shampoo', 2, 'https://lh3.googleusercontent.com/aida-public/AB6AXuADdt37ik6aEox2iXLxlpzsdFnyjQTEVbJvnGynQ0995XPthRdC3KSywQvjT1IRGhB0wXYCAjpPYXenSz2twZ4xPfBqhHIMZBSzoyURlES7qosEdXb7CqRuheCRTrk2TtETyjYTgrdtKNIZxiXB2ucm3UL1nDJgO8m_FwIjBzUzO-x9IQ1lGJ-m-cCTlYW_G9wUXvBGQip0mTQjluHQatg0UzHxDexJVqk9SPdxVo9C7QoQZL2a_nC-gSQYXc237uQv3IGYQF0Tzxk', 'Amenities');

INSERT INTO rooms (number, group_name) VALUES
(101, 'Casa 1'), (102, 'Casa 1'), (103, 'Casa 1'),
(201, 'Casa 2'), (202, 'Casa 2');

INSERT INTO inventory (room_id, product_id, quantity)
SELECT r.id, p.id, p.par
FROM rooms r, products p;
