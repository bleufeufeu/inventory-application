#! /usr/bin/env node

const { Client } = require("pg");
require("dotenv").config();

const SQL = `
DROP TABLE IF EXISTS pokemon_types;
DROP TABLE IF EXISTS pokemon_region;
DROP TABLE IF EXISTS trainers_region;
DROP TABLE IF EXISTS trainers_pokemon;
DROP TABLE IF EXISTS pokemon;
DROP TABLE IF EXISTS types;
DROP TABLE IF EXISTS regions;
DROP TABLE IF EXISTS trainers;

CREATE TABLE IF NOT EXISTS types (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR (255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS pokemon (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR (255) UNIQUE NOT NULL,
  dex_num INTEGER UNIQUE NOT NULL,
  img_file VARCHAR (255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS regions (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR (255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS trainers (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR (255) NOT NULL,
  img_file VARCHAR (255) NOT NULL
);

CREATE TABLE IF NOT EXISTS pokemon_types (
  pokemon_id INTEGER NOT NULL,
  type_id INTEGER NOT NULL,
  PRIMARY KEY (pokemon_id, type_id),
  FOREIGN KEY (pokemon_id) REFERENCES pokemon(id) ON DELETE CASCADE,
  FOREIGN KEY (type_id) REFERENCES types(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pokemon_region (
  pokemon_id INTEGER NOT NULL,
  region_id INTEGER NOT NULL,
  PRIMARY KEY (pokemon_id, region_id),
  FOREIGN KEY (pokemon_id) REFERENCES pokemon(id) ON DELETE CASCADE,
  FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS trainers_region (
  trainer_id INTEGER NOT NULL,
  region_id INTEGER NOT NULL,
  PRIMARY KEY (trainer_id, region_id),
  FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE,
  FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS trainers_pokemon (
  trainer_id INTEGER NOT NULL,
  pokemon_id INTEGER NOT NULL,
  FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE,
  FOREIGN KEY (pokemon_id) REFERENCES pokemon(id) ON DELETE CASCADE
);

INSERT INTO types (name) 
VALUES
  ('Normal'),
  ('Fighting'),
  ('Flying'),
  ('Poison'),
  ('Ground'),
  ('Rock'),
  ('Bug'),
  ('Ghost'),
  ('Steel'),
  ('Fire'),
  ('Water'),
  ('Grass'),
  ('Electric'),
  ('Psychic'),
  ('Ice'),
  ('Dragon'),
  ('Dark');

INSERT INTO pokemon (name, dex_num, img_file)
VALUES
  ('Charizard', 6, 'charizard.png'),
  ('Blastoise', 9, 'blastoise.png'),
  ('Beedrill', 15, 'beedrill.png'),
  ('Sandslash', 28, 'sandslash.png'),
  ('Primeape', 57, 'primeape.png'),
  ('Rapidash', 78, 'rapidash.png'),
  ('Marowak', 105, 'marowak.png'),
  ('Kangaskhan', 115, 'kangaskhan.png'),
  ('Electabuzz', 125, 'electabuzz.png'),
  ('Gyarados', 130, 'gyarados.png'),
  ('Jolteon', 135, 'jolteon.png'),
  ('Dragonite', 149, 'dragonite.png'),
  ('Meganium', 154, 'meganium.png'),
  ('Typhlosion', 157, 'typhlosion.png'),
  ('Crobat', 169, 'crobat.png'),
  ('Lanturn', 171, 'lanturn.png'),
  ('Ampharos', 181, 'ampharos.png'),
  ('Politoed', 186, 'politoed.png'),
  ('Girafarig', 203, 'girafarig.png'),
  ('Steelix', 208, 'steelix.png'),
  ('Granbull', 210, 'granbull.png'),
  ('Heracross', 214, 'heracross.png'),
  ('Sneasel', 215, 'sneasel.png'),
  ('Magcargo', 219, 'magcargo.png'),
  ('Donphan', 232, 'donphan.png'),
  ('Sceptile', 254, 'sceptile.png'),
  ('Swampert', 260, 'swampert.png'),
  ('Pelipper', 279, 'pelipper.png'),
  ('Ninjask', 291, 'ninjask.png'),
  ('Hariyama', 297, 'hariyama.png'),
  ('Manectric', 310, 'manectric.png'),
  ('Flygon', 330, 'flygon.png'),
  ('Cacturne', 332, 'cacturne.png'),
  ('Armaldo', 348, 'armaldo.png'),
  ('Banette', 354, 'banette.png'),
  ('Absol', 359, 'absol.png');

INSERT INTO regions (name)
VALUES
  ('Kanto'),
  ('Johto'),
  ('Hoenn');

INSERT INTO trainers (name, img_file)
VALUES
  ('Red', 'red.png'),
  ('Leaf', 'leaf.png'),
  ('Ethan', 'ethan.png'),
  ('Lyra', 'lyra.png'),
  ('Brendan', 'brendan.png'),
  ('May', 'may.png');

INSERT INTO pokemon_types (pokemon_id, type_id)
VALUES
  (1, 10),
  (1, 3),
  (2, 11),
  (3, 7),
  (3, 4),
  (4, 5),
  (5, 2),
  (6, 10),
  (7, 5),
  (8, 1),
  (9, 13),
  (10, 11),
  (10, 3),
  (11, 13),
  (12, 16),
  (12, 3),
  (13, 12),
  (14, 10),
  (15, 4),
  (15, 3),
  (16, 11),
  (16, 13),
  (17, 13),
  (18, 11),
  (19, 1),
  (19, 14),
  (20, 9),
  (20, 5),
  (21, 1),
  (22, 7),
  (22, 2),
  (23, 15),
  (23, 17),
  (24, 10),
  (24, 6),
  (25, 5),
  (26, 12),
  (27, 5),
  (27, 11),
  (28, 11),
  (28, 3),
  (29, 7),
  (29, 3),
  (30, 2),
  (31, 13),
  (32, 16),
  (32, 5),
  (33, 12),
  (33, 17),
  (34, 7),
  (34, 6),
  (35, 8),
  (36, 17);

INSERT INTO pokemon_region (pokemon_id, region_id)
VALUES
  (1, 1),
  (2, 1),
  (3, 1),
  (4, 1),
  (5, 1),
  (6, 1),
  (7, 1),
  (8, 1),
  (9, 1),
  (10, 1),
  (11, 1),
  (12, 1),
  (13, 2),
  (14, 2),
  (15, 2),
  (16, 2),
  (17, 2),
  (18, 2),
  (19, 2),
  (20, 2),
  (21, 2),
  (22, 2),
  (23, 2),
  (24, 2),
  (25, 2),
  (26, 3),
  (27, 3),
  (28, 3),
  (29, 3),
  (30, 3),
  (31, 3),
  (32, 3),
  (33, 3),
  (34, 3),
  (35, 3),
  (36, 3);

INSERT INTO trainers_region (trainer_id, region_id)
VALUES
  (1, 1),
  (2, 1),
  (3, 2),
  (4, 2),
  (5, 3),
  (6, 3);

INSERT INTO trainers_pokemon (trainer_id, pokemon_id)
VALUES
  (1, 1),
  (1, 5),
  (1, 7),
  (1, 8),
  (1, 9),
  (1, 10),
  (2, 2),
  (2, 3),
  (2, 4),
  (2, 6),
  (2, 11),
  (2, 12),
  (3, 13),
  (3, 15),
  (3, 16),
  (3, 20),
  (3, 21),
  (3, 23),
  (4, 14),
  (4, 17),
  (4, 18),
  (4, 19),
  (4, 22),
  (4, 25),
  (5, 27),
  (5, 29),
  (5, 31),
  (5, 24),
  (5, 33),
  (5, 35),
  (6, 26),
  (6, 28),
  (6, 30),
  (6, 32),
  (6, 34),
  (6, 36);
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.DB_URL,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
