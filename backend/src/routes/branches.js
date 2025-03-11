/*
Este archivo sirve para definir que metodos del CRUD va a tener mi ruta 
(/api/branches)
*/

import express from "express";

import branchesController from "../controllers/branchesController.js";

const router = express.Router();

router.route("/")
    .get(branchesController.getBranches)
    .post(branchesController.insertBranch)

router.route("/:id")
    .put(branchesController.updateBranch)
    .delete(branchesController.deleteBranch);
    
export default router;

