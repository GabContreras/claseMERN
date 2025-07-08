/* 
product
category
customer 
total
*/

import { model, Schema } from 'mongoose';

const salesSchema = new Schema({
    product: {
        type: String,
        ref: 'product',
        required: true
    },
    category: {
        type: String,
        ref: 'category',
        required: true
    },
    customer: {
        type: String,
        ref: 'customer',
        required: true
    },
    total: {
        type: Number,
        required: true
    }
},
    {
        timestamps: true,
        strict: false
    });
export default model('sales', salesSchema);