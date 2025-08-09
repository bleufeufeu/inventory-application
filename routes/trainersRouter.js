const { Router } = require("express");
const trainersRouter = Router();

const trainersController = require("../controllers/trainersController.js");

trainersRouter.get("/", trainersController.getAllTrainers);
trainersRouter.post("/", trainersController.postNewTrainer);
trainersRouter.get("/new", trainersController.getNewTrainerForm);
trainersRouter.get("/:trainerId/edit", trainersController.getEditTrainerForm);
trainersRouter.post("/:trainerId/edit", trainersController.postEditTrainer);
trainersRouter.post("/:trainerId/delete", trainersController.postDeleteTrainer);
trainersRouter.get("/:trainerId", trainersController.getTrainerIndividual);

module.exports = trainersRouter;
