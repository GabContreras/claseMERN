/*Este archivo tiene los métodos del CRUD
    (Select, insert, update, delete)
    */

//Creo un array de funciones 
const reviewsController = {};
import reviewsModel from "../models/Reviews.js"

//SELECT

reviewsController.getReviews = async (req, res) => {
    const reviews = await reviewsModel.find().populate("idClient");
    res.json(reviews);
}

//INSERT

reviewsController.insertReview = async (req, res) => {
    const { idClient, rating, comment } = req.body;
    const newReview = new reviewsModel({ idClient, rating, comment });
    await newReview.save();
    res.json({ message: "Review saved" });
}

//UPDATE

reviewsController.updateReview = async (req, res) => {
    const { idClient, rating, comment } = req.body;
    const updateReview = await reviewsModel.findByIdAndUpdate(req.params.id,
        { idClient, rating, comment }, { new: true });
        res.json({ message: "Review updated" });

}

//DELETE

reviewsController.deleteReview = async (req, res) => {
    await reviewsModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Review deleted" });
}

export default reviewsController;