import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import clientsModel from "../models/Clients.js";
import employeeModel from "../models/Employees.js";

import { config } from "../config.js"
import { sendMail, HTMLRecoveryEmail } from "../utils/MailPasswordrecovery.js"

//1- Creo un array de funciones

const passwordRecoveryController = {};

passwordRecoveryController.requestCode = async (req, res) => {
    const { email } = req.body
    //buscakmos si el correo está en la coleccion de clientes
   try {
    let userFound;
    let userType
        userFound = await clientsModel.findOne({ email })

        if(userFound){
            userType = "client"
        }else 
        {
            userFound = await employeeModel.findOne({email})
            if(userFound){
                userType = "employee"
            }
        }
 
        //si no encuentra ni en clientes ni en empleados
        if (!userFound){
            return res.json({message: "User not found"})
        }
        //Generar un codigo aleatorio
       const code = Math.floor(10000 + Math.random() * 90000).toString()

       //Crear un token que guarde todo 
       const token = jsonwebtoken.sign(
        //1-¿Qué voy a guardar?
        {email, code, userType, verified: false},
        //2- secret key
        config.JWT.secret,
        //3- ¿cuando expira?
        {expiresIn: "30m"}
       );

       res.cookie("tokenRecoveryCode", token, {maxAge: 20 * 60 * 1000})

       //ULTIMO PASO, enviar el correo 
       await sendMail(
        email, 
        "Password recovery code", //Asun to
        `Yout verification code is: ${code}`, //Texto
        HTMLRecoveryEmail(code) //
        
       )
    } catch(error) {
    }

}