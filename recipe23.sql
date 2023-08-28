-- Active: 1689757686357@@147.139.210.135@5432@damas01

CREATE TABLE
    recipe(
        id SERIAL,
        title VARCHAR NOT NULL,
        ingredients TEXT NOT NULL,
        category VARCHAR NOT NULL,
        photo VARCHAR NOT NULL
    )



INSERT INTO
    recipe(
        title,
        ingredients,
        category,
        photo
    )
VALUES
(
        'telur gulung',
        'telur, msg, bihun, saus',
        'appetizer',
        'https://placehold.co/600x400'
    );

   ALTER TABLE recipe DROP COLUMN category;

   CREATE TABLE category(
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL
);

INSERT INTO category(name) VALUES('main course');
INSERT INTO category(name) VALUES('desert');
INSERT INTO category(name) VALUES('appetizer');

ALTER TABLE recipe ADD COLUMN category_id INT;

UPDATE recipe SET category_id=1 WHERE photo='https://placehold.co/600x400';

ALTER TABLE recipe ALTER COLUMN category_id SET NOT NULL;

ALTER TABLE recipe ADD FOREIGN KEY (category_id) REFERENCES category(id);

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL
);

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    photo VARCHAR,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO users(username,email,password) VALUES('admin','admin@admin.id','123456');
INSERT INTO users(username,email,password) VALUES('guest','guest@admin.id','123456');

INSERT INTO users(name,email) VALUES('Rangga','rangga@yahoo.com');

ALTER TABLE recipe ADD COLUMN users_id INT;

UPDATE recipe SET users_id=2 WHERE photo='https://placehold.co/600x400';

ALTER TABLE recipe ALTER COLUMN users_id SET NOT NULL;

ALTER TABLE recipe ADD FOREIGN KEY (users_id) REFERENCES users(id);

UPDATE users SET password='$argon2id$v=19$m=65536,t=3,p=4$7WPNW/O08arH1vs1tVG++w$cgfqZCfmZ29bgQmb2oN1zLHi0BtpaDqXp8IL6jd0GUY' WHERE email='guest@admin.id';
DROP TABLE users;