const db = require("../db/queries");

async function getAllTrainers(req, res) {
  let trainers = await db.selectAllTrainers();
  const regions = await db.selectAllRegions();

  const selectedRegion = req.query.region;

  if (!selectedRegion) {
    res.render("trainers", {
      title: "Trainer List",
      trainers: trainers,
      regions: regions,
    });
  }

  if (selectedRegion) {
    trainers = await db.selectTrainersByRegion(selectedRegion);
    res.render("trainers", {
      title: "Trainer List",
      trainers: trainers,
      regions: regions,
    });
  }
}

async function getTrainerIndividual(req, res) {
  const { trainerId } = req.params;
  const trainer = await db.selectTrainerById(trainerId);
  if (!trainer) {
    return res
      .status(404)
      .render("error", { errorMessage: "Trainer not found!" });
  }
  try {
    const party = [];

    if (Array.isArray(trainer.team)) {
      for (const member of trainer.team) {
        const memberDetails = await db.selectPokemonByName(member);
        if (memberDetails) {
          party.push(memberDetails);
        }
      }
    }
    res.render("trainerIndividual", { trainer: trainer, party: party });
  } catch (err) {
    console.error("Error fetching trainer:", err);
    res.status(500).send("Server error");
  }
}

async function getNewTrainerForm(req, res) {
  const regions = await db.selectAllRegions();
  res.render("trainersNew", { regions: regions });
}

async function getEditTrainerForm(req, res) {
  const regions = await db.selectAllRegions();
  const pokemon = await db.selectAllPokemon();
  const { trainerId } = req.params;
  const trainer = await db.selectTrainerById(trainerId);

  if (!trainer) {
    return res
      .status(404)
      .render("error", { errorMessage: "Trainer not found!" });
  }
  try {
    const party = [];

    if (Array.isArray(trainer.team)) {
      for (const member of trainer.team) {
        const memberDetails = await db.selectPokemonByName(member);
        if (memberDetails) {
          party.push(memberDetails);
        }
      }
      while (party.length < 6) {
        party.push("");
      }
    }
    res.render("trainersEdit", {
      trainer: trainer,
      regions: regions,
      party: party,
      pokemon: pokemon,
    });
  } catch (err) {
    console.error("Error fetching trainer:", err);
    res.status(500).send("Server error");
  }
}

async function postNewTrainer(req, res) {
  const trainerName = req.body.trainerName;
  const trainerSprite = req.body.trainerSprite;
  const trainerRegion = req.body.region;
  await db.insertNewTrainer(trainerName, trainerSprite, trainerRegion);
  res.redirect("/trainers");
}

async function postEditTrainer(req, res) {
  const trainerName = req.body.trainerName;
  const trainerSprite = req.body.trainerSprite;
  const trainerRegion = req.body.region;
  const trainerParty = req.body.partyMembers;
  const { trainerId } = req.params;

  console.log(trainerParty);

  try {
    await db.editTrainer(trainerName, trainerSprite, trainerRegion, trainerId);
    await db.editTrainerParty(trainerId, trainerParty);
    res.redirect(`/trainers/${trainerId}`);
  } catch (error) {
    console.error("Edit failed:", error);
    res.status(500).send("Error updating trainer");
  }
}

async function postDeleteTrainer(req, res) {
  const { trainerId } = req.params;

  try {
    await db.deleteTrainer(trainerId);
    res.redirect("/trainers");
  } catch (error) {
    console.error("Edit failed:", error);
    res.status(500).send("Error updating trainer");
  }
}

module.exports = {
  getAllTrainers,
  getTrainerIndividual,
  getNewTrainerForm,
  getEditTrainerForm,
  postNewTrainer,
  postEditTrainer,
  postDeleteTrainer,
};
