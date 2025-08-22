/*
Fields:
name
  lastName
  birthday (esto es de tipo Date o lo puden poner como String)
  email
  address
  hireDate (esto es de tipo Date o lo puden poner como String)
  password
  telephone
  dui
  isssNumber
  isVerified (esto es booleano)
*/


import { Schema, model } from "mongoose";

const employeeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  hireDate: {
    type: Date,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  telephone: {
    type: String,
    required: true,
    unique: true,
  },
  dui: {
    type: String,
    required: true,
    unique: true,
  },
  isssNumber: {
    type: String,
    required: true,
    unique: true,
  },
  isVerified: {
    type: Boolean,
    required: true,
  },
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockTime: {
        type: Date,
        default: null
    }
}, {
  timestamps: true,
  strict: false
});

export default model("Employees", employeeSchema);