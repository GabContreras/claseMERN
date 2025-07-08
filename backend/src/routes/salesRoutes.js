import express from "express";
import salesController from "../controllers/salesController.js";

const router = express.Router();

router.route('/')
    .get(salesController.getAllSales)
    .post(salesController.createSale);

router.route('/getsalesbycategory')
    .get(salesController.getSalesByCategory);


router.route('/getBestSellingProducts')
    .get(salesController.getBestSelledProducts);

router.route('/totalearnings')
    .get(salesController.getTotalEarnings);

export default router;