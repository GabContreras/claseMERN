/*Este archivo tiene los métodos del CRUD
    (Select, insert, update, delete)
    */

//Creo un array de funciones 
const clientsController = {};
import clientsModel from "../models/Clients.js";

//SELECT

clientsController.getClients = async (req, res) => {
    const clients = await clientsModel.find();
    res.json(clients);
}

//INSERT

clientsController.insertClient = async (req, res) => {
    const { name, lastName, birthday, email, password, telephone, dui, isVerified } = req.body;
    const newClient = new clientsModel({ name, lastName, birthday, email, password, telephone, dui, isVerified });
    await newClient.save();
    res.json({ message: "Client saved" });
}

//DELETE

clientsController.deleteClient = async (req, res) => {
    await clientsModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Client deleted" });
}

//UPDATE

clientsController.updateClient = async (req, res) => {
    const { name, lastName, birthday, email, password, telephone, dui, isVerified } = req.body;
    const updateClients = await clientsModel.findByIdAndUpdate(req.params.id,
        { name, lastName, birthday, email, password, telephone, dui, isVerified }, { new: true });
    res.json({ message: "Client updated successfully" });
}

export default clientsController;


