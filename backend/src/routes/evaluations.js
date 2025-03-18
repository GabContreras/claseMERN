/*
Este archivo sirve para definir que metodos del CRUD va a tener mi ruta 
(/api/evaluations)
*/

import express from 'express';
import evaluationsController from '../controllers/evaluationsController.js';

const router = express.Router();

router.route("/")
    .get(evaluationsController.getEvaluations)
    .post(evaluationsController.insertEvaluation)

router.route("/:id")
    .put(evaluationsController.updateEvaluation)
    .delete(evaluationsController.deleteEvaluation)

export default router;