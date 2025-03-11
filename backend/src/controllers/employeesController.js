/*Este archivo tiene los métodos del CRUD
    (Select, insert, update, delete)
    */

//Creo un array de funciones 

const employeesController = {};
import employeesModel from "../models/Employees.js";

//SELECT
employeesController.getEmployees = async (req, res) => {
    const employees = await employeesModel.find();
    res.json(employees);
}
//INSERT
employeesController.insertEmployee = async (req, res) => {
    const { name, lastName, birthday, email, address, hireDate, password, telephone, dui, isssNumber, isVerified } = req.body;
    const newEmployee = new employeesModel({ name, lastName, birthday, email, address, hireDate, password, telephone, dui, isssNumber, isVerified });
    await newEmployee.save();
    res.json({ message: "Employee saved" });
}
//UPDATE
employeesController.updateEmployee = async (req, res) => {
    const { id } = req.params;
    const { name, lastName, birthday, email, address, hireDate, password, telephone, dui, isssNumber, isVerified } = req.body;
    await employeesModel.findByIdAndUpdate(id, { name, lastName, birthday, email, address, hireDate, password, telephone, dui, isssNumber, isVerified });
    res.json({ message: "Employee updated" });
}

//DELETE
employeesController.deleteEmployee = async (req, res) => {
    await employeesModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted" });
}
export default employeesController;
