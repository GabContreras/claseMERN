/*Este archivo tiene los métodos del CRUD
    (Select, insert, update, delete)
    */

//Creo un array de funciones 
const branchesController = {};
import branchesModel from "../models/Branches.js";

//SELECT
branchesController.getBranches = async (req, res) => {
    const branches = await branchesModel.find();
    res.json(branches);
}

//INSERT

branchesController.insertBranch = async (req, res) => {
    const { name, address, telephone, schedule } = req.body;
    const newBranch = new branchesModel({ name, address, telephone, schedule });
    await newBranch.save();
    res.json({ message: "Branch saved" });
}

//UPDATE

branchesController.updateBranch = async (req, res) => {
    const { name, address, telephone, schedule } = req.body;
    const updateBranches = await branchesModel.findByIdAndUpdate(req.params.id,
        { name, address, telephone, schedule }, { new: true });
    res.json({ message: "Branch updated successfully" });
}

//DELETE

branchesController.deleteBranch = async (req, res) => {
    await branchesModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Branch deleted" });
}

export default branchesController;