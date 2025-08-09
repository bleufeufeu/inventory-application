const db = require("../db/queries");

async function getAllPokemon(req, res) {
  const pokemon = await db.selectAllPokemon();
  const types = await db.selectAllTypes();

  const selectedTypes = req.query.types;

  if (!selectedTypes) {
    console.log("Pokemon: ", pokemon);
    return res.render("pokemon", {
      title: "Pokemon",
      pokemon: pokemon,
      types: types,
    });
  }

  console.log(selectedTypes);
  const typesArray = Array.isArray(selectedTypes)
    ? selectedTypes
    : [selectedTypes];
  const filteredPokemon = await db.selectPokemonByType(typesArray);

  res.render("pokemon", {
    title: "Pokémon",
    pokemon: filteredPokemon,
    types: types,
  });
}

async function getPokemonIndividual(req, res) {
  const { pokemonName } = req.params;
  const pokemon = await db.selectPokemonByName(pokemonName);
  if (!pokemon) {
    return res
      .status(404)
      .render("error", { errorMessage: "Pokémon not found!" });
  }
  try {
    res.render("pokemonIndividual", { title: "Hello", pokemon: pokemon });
  } catch (err) {
    console.error("Error fetching message:", err);
    res.status(500).send("Server error");
  }
}

module.exports = {
  getAllPokemon,
  getPokemonIndividual,
};
