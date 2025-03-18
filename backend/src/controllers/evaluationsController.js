/*Este archivo tiene los métodos del CRUD
    (Select, insert, update, delete)
    */

//Creo un array de funciones 
const evaluationsController = {};
import evaluationsModel from "../models/Evaluations.js"

//SELECT

evaluationsController.getEvaluations = async (req, res) => {
    const evaluations = await evaluationsModel.find().populate("idEmployee");
    res.json(evaluations);

}

//INSERT

evaluationsController.insertEvaluation = async (req, res) => {
    const { Comment, Grade, Role, idEmployee } = req.body;
    const newEvaluation = new evaluationsModel({ Comment, Grade, Role, idEmployee });
    await newEvaluation.save();
    res.json({ message: "Evaluation saved" });

}


//UPDATE}

evaluationsController.updateEvaluation = async (req, res) => {
    const { Comment, Grade, Role, idEmployee } = req.body;
    const updateEvaluation = await evaluationsModel.findByIdAndUpdate(req.params.id,
        { Comment, Grade, Role, idEmployee }, { new: true });
        res.json({ message: "Evaluation updated" });

}

//DELETE

evaluationsController.deleteEvaluation = async (req, res) => {
    await evaluationsModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Evaluation deleted" });

}

export default evaluationsController;

