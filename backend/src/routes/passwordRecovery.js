import express from "express";

const router = express.Router();

router.route("/").post();
router.route("/verifyCode").post();
router.route("/newPassword").post();


export default router;