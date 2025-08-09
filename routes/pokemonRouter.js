const { Router } = require("express");
const pokemonRouter = Router();

const pokemonController = require("../controllers/pokemonController.js");

pokemonRouter.get("/", pokemonController.getAllPokemon);
pokemonRouter.get("/:pokemonName", pokemonController.getPokemonIndividual);

module.exports = pokemonRouter;
