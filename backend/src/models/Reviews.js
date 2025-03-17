/*
Fields:
Comment 
Rating
IdClient
*/

import { Schema, model } from "mongoose";

const reviewSchema = new Schema({
    comment: {
        type: String,
        require: true
    },
    rating: {
        type: Number,
        require: true,
        min: 1,
        max: 5
    },
    idClient: {
        type: Schema.Types.ObjectId,
        ref: "Clients",
        required: true
    },
},{
    timestamps: true,
    strict: false
})

export default model("Reviews", reviewSchema);