/*
Este archivo sirve para definir que metodos del CRUD va a tener mi ruta 
(/api/reviews)
*/

import express from 'express';
import reviewsController from '../controllers/reviewsController.js';

const router = express.Router();

router.route("/")
    .get(reviewsController.getReviews)
    .post(reviewsController.insertReview)

router.route("/:id")
    .put(reviewsController.updateReview)
    .delete(reviewsController.deleteReview)
export default router;