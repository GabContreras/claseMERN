import express from "express"
import faqController from "../controllers/faqsController.js";

const router = express.Router();
router.route("/")
    .get(faqController.getAllFaqs)
    .post(faqController.insertFaq);
router.route("/:id")   
    .put(faqController.updateFaqs)
    .delete(faqController.deleteFaqs);
export default router;