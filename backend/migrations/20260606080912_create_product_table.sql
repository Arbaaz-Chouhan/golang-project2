-- +goose Up
CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    discreption TEXT NOT NULL,
    image VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    category VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
    
-- +goose Down
DROP TABLE product;
