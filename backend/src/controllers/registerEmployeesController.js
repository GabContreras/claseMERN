import EmployeeModel from "../models/Employees.js";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";

const registerEmployeesController = {};

registerEmployeesController.register = async (req, res) => {
    const { name, lastName, birthday, email, address, hireDate, password, telephone, dui, isssNumber, isVerified } = req.body;

    try {
        //Verificamos si el empleado ya existe
        const existsEmployee = await EmployeeModel.findOne({ email });
        if (existsEmployee) {
            return res.json({ message: "El empleado ya existe" });
        }
        //Encriptar la contraseña
        const passwordHash = await bcryptjs.hash(password, 10)

        //Crear un nuevo empleado
        const newEmployee = new EmployeeModel({ name, lastName, birthday, email, address, hireDate, password: passwordHash, telephone, dui, isssNumber, isVerified });
        await newEmployee.save();

        //--> TOKEN <--
        jsonwebtoken.sign(
            //1- Que voy a guardar
            {id: newEmployee._id},
            //2-secreto 
            config.JWT.secret,
            //3- cuándo expira
            {expiresIn: config.JWT.expiresIn},
            //4- función flecha
            (error,token)=>{
                if(error) console.log(error);
                res.cookie("authToken",token);
            }
        ) 
    } catch (error) {
        console.log(error);
    }
};
export default registerEmployeesController;