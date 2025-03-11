/*
Fields:
name
  lastName
  birthday
  email
  password
  telephone
  dui
  isVerified (esto es booleano)
*/
import { Schema, model } from "mongoose";

const clientsSchema = new Schema({
    lastName: {
        type: String,
        require: true
    },
    birthday: {
        type: Date,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    telephone: {
        type: String,
        require: true,
        unique: true
    },
    dui: {
        type: String,
        require: true,
        unique: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    strict: false
});

export default model("Clients", clientsSchema);