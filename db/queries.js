const pool = require("./pool");

async function selectAllTypes() {
  const { rows } = await pool.query(`SELECT * FROM types;`);
  return rows;
}

async function selectAllRegions() {
  const { rows } = await pool.query(`SELECT * FROM regions;`);
  return rows;
}

async function selectAllTrainers() {
  const { rows } = await pool.query(`SELECT 
                                      t.id,
                                      t.name,
                                      t.img_file,
                                      (SELECT r.name FROM trainers_region tr 
                                       JOIN regions r ON tr.region_id = r.id
                                       WHERE tr.trainer_id = t.id LIMIT 1) AS region
                                      FROM trainers t
                                      GROUP BY t.name, t.id
                                      ORDER BY t.id;`);
  return rows;
}

async function selectAllPokemon() {
  const { rows } = await pool.query(`SELECT 
                                      p.name,
                                      p.dex_num, 
                                      p.img_file, 
                                      (SELECT r.name FROM pokemon_region pr 
                                       JOIN regions r ON pr.region_id = r.id
                                       WHERE pr.pokemon_id = p.id LIMIT 1) AS region, 
                                      ARRAY_AGG(t.name ORDER BY t.name) AS types 
                                      FROM pokemon p 
                                      LEFT JOIN pokemon_types pt 
                                      ON p.id = pt.pokemon_id 
                                      LEFT JOIN types t 
                                      ON pt.type_id = t.id 
                                      GROUP BY p.id, p.name, p.dex_num, p.img_file 
                                      ORDER BY p.dex_num;`);
  return rows;
}

async function selectAllTrainersAndTeams() {
  const { rows } = await pool.query(`SELECT 
                                      t.name,
                                      (SELECT r.name FROM trainers_region tr 
                                       JOIN regions r ON tr.region_id = r.id
                                       WHERE tr.trainer_id = t.id LIMIT 1) AS region,
                                      ARRAY_AGG(p.name ORDER BY p.dex_num) AS team
                                      FROM trainers t
                                      LEFT JOIN trainers_pokemon tp
                                      ON t.id = tp.trainer_id
                                      LEFT JOIN pokemon p
                                      ON tp.pokemon_id = p.id
                                      GROUP BY t.name, t.id
                                      ORDER BY t.id;`);
  return rows;
}

async function selectTrainersByRegion(region) {
  const { rows } = await pool.query(
    `SELECT 
                                      t.name,
                                      t.img_file,
                                      t.id,
                                      r.name AS region
                                      FROM trainers t
                                      LEFT JOIN trainers_region tr
                                      ON t.id = tr.trainer_id
                                      LEFT JOIN regions r
                                      ON tr.region_id = r.id
                                      WHERE r.name = $1
                                      GROUP BY t.name, t.id, r.name
                                      ORDER BY t.id;`,
    [region],
  );
  return rows;
}

async function selectTrainerById(trainerId) {
  const { rows } = await pool.query(
    `SELECT 
                                      t.name,
                                      t.img_file,
                                      t.id,
                                      r.name AS region,
                                      ARRAY_AGG(p.name ORDER BY p.dex_num) AS team
                                      FROM trainers t
                                      LEFT JOIN trainers_region tr
                                      ON t.id = tr.trainer_id
                                      LEFT JOIN regions r
                                      ON tr.region_id = r.id
                                      LEFT JOIN trainers_pokemon tp
                                      ON t.id = tp.trainer_id
                                      LEFT JOIN pokemon p
                                      ON tp.pokemon_id = p.id
                                      WHERE t.id = $1
                                      GROUP BY t.name, t.id, t.img_file, r.name
                                      ORDER BY t.id;`,
    [trainerId],
  );
  return rows[0];
}
async function selectPokemonByName(pokemonName) {
  const { rows } = await pool.query(
    `SELECT 
                                      p.name,
                                      p.dex_num, 
                                      p.img_file, 
                                      (SELECT r.name FROM pokemon_region pr 
                                       JOIN regions r ON pr.region_id = r.id
                                       WHERE pr.pokemon_id = p.id LIMIT 1) AS region, 
                                      ARRAY_AGG(t.name ORDER BY t.name) AS types 
                                      FROM pokemon p 
                                      LEFT JOIN pokemon_types pt 
                                      ON p.id = pt.pokemon_id 
                                      LEFT JOIN types t 
                                      ON pt.type_id = t.id 
                                      WHERE p.name = $1
                                      GROUP BY p.id, p.name, p.dex_num, p.img_file 
                                      ORDER BY p.dex_num;`,
    [pokemonName],
  );
  return rows[0];
}

async function selectPokemonByType(type) {
  const { rows } = await pool.query(
    `SELECT 
                                      p.name,
                                      p.dex_num, 
                                      p.img_file, 
                                      (SELECT r.name FROM pokemon_region pr 
                                       JOIN regions r ON pr.region_id = r.id
                                       WHERE pr.pokemon_id = p.id LIMIT 1) AS region, 
                                      ARRAY_AGG(t.name ORDER BY t.name) AS types 
                                      FROM pokemon p 
                                      LEFT JOIN pokemon_types pt 
                                      ON p.id = pt.pokemon_id 
                                      LEFT JOIN types t 
                                      ON pt.type_id = t.id 
                                      WHERE EXISTS (
                                        SELECT 1
                                        FROM pokemon_types pt2
                                        JOIN types t2 ON pt2.type_id = t2.id
                                        WHERE pt2.pokemon_id = p.id
                                        AND t2.name = ANY($1)
                                        GROUP BY pt2.pokemon_id
                                        HAVING COUNT(DISTINCT t2.name) = array_length($1, 1)
                                      )
                                      GROUP BY p.id, p.name, p.dex_num, p.img_file 
                                      ORDER BY p.dex_num;`,
    [type],
  );
  return rows;
}

async function selectPokemonByRegion(region) {
  const { rows } = await pool.query(
    `SELECT 
                                      p.name,
                                      p.dex_num, 
                                      p.img_file, 
                                      r.name AS region,
                                      STRING_AGG(t.name, ', ' ORDER BY t.name) AS types
                                      FROM pokemon p
                                      LEFT JOIN pokemon_region pr
                                      ON p.id = pr.pokemon_id
                                      LEFT JOIN regions r
                                      ON pr.region_id = r.id
                                      LEFT JOIN pokemon_types pt 
                                      ON p.id = pt.pokemon_id 
                                      LEFT JOIN types t 
                                      ON pt.type_id = t.id 
                                      WHERE r.name = '$1'
                                      GROUP BY p.id, p.name, p.dex_num, p.img_file, r.name 
                                      ORDER BY p.dex_num;`,
    [region],
  );
  return rows;
}

async function insertNewTrainer(name, img_file, region) {
  try {
    const trainerResult = await pool.query(
      "INSERT INTO trainers (name, img_file) VALUES ($1, $2) RETURNING id",
      [name, img_file],
    );
    const trainerId = trainerResult.rows[0].id;

    const regionResult = await pool.query(
      "SELECT id FROM regions WHERE name = $1",
      [region],
    );

    if (regionResult.rows.length === 0) {
      throw new Error("Region not found");
    }

    const regionId = regionResult.rows[0].id;

    await pool.query(
      "INSERT INTO trainers_region (trainer_id, region_id) VALUES ($1, $2)",
      [trainerId, regionId],
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function editTrainer(name, img_file, region, trainerId) {
  try {
    await pool.query(
      "UPDATE trainers SET name = $1, img_file = $2 WHERE id = $3",
      [name, img_file, trainerId],
    );

    const regionResult = await pool.query(
      "SELECT id FROM regions WHERE name = $1",
      [region],
    );

    if (regionResult.rows.length === 0) {
      throw new Error("Region not found");
    }

    const regionId = regionResult.rows[0].id;

    await pool.query(
      "UPDATE trainers_region SET region_id = $1 WHERE trainer_id = $2",
      [regionId, trainerId],
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function editTrainerParty(trainerId, newParty) {
  try {
    await pool.query(
      "DELETE FROM trainers_pokemon tp WHERE tp.trainer_id = $1",
      [trainerId],
    );

    for (const member of newParty) {
      if (member === "") {
        continue;
      }

      const memberResult = await pool.query(
        "SELECT id FROM pokemon WHERE name = $1",
        [member],
      );
      const memberId = memberResult.rows[0].id;
      await pool.query(
        "INSERT INTO trainers_pokemon (trainer_id, pokemon_id) VALUES ($1, $2)",
        [trainerId, memberId],
      );
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function deleteTrainer(trainerId) {
  try {
    await pool.query("DELETE FROM trainers WHERE id = $1", [trainerId]);
    await pool.query(
      "DELETE FROM trainers_pokemon tp WHERE tp.trainer_id = $1",
      [trainerId],
    );
    await pool.query(
      "DELETE FROM trainers_region tr WHERE tr.trainer_id = $1",
      [trainerId],
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  selectAllTypes,
  selectAllRegions,
  selectAllTrainers,
  selectAllPokemon,
  selectAllTrainersAndTeams,
  selectTrainersByRegion,
  selectTrainerById,
  selectPokemonByName,
  selectPokemonByType,
  selectPokemonByRegion,
  insertNewTrainer,
  editTrainer,
  editTrainerParty,
  deleteTrainer,
};
