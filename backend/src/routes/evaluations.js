/*
Este archivo sirve para definir que metodos del CRUD va a tener mi ruta 
(/api/evaluations)
*/

import express from 'express';
import evaluationsController from '../controllers/evaluationsController.js';
import { validateAuthToken } from "../middlewares/validateAuthToken.js";

const router = express.Router();

router.route("/")
    .get(evaluationsController.getEvaluations)
    .post(validateAuthToken(["employee", "admin"]),evaluationsController.insertEvaluation)

router.route("/:id")
    .put(validateAuthToken(["employee", "admin"]),evaluationsController.updateEvaluation)
    .delete(validateAuthToken(["employee", "admin"]),evaluationsController.deleteEvaluation)

export default router;