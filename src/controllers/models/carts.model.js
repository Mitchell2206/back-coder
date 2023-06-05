import mongoose from 'mongoose';
import { userModel } from './product.model.js';

const cartSchema = new mongoose.Schema({
    name: String,
    products: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: ' userModel ',
        require: false,
        default: []
    },

});



export const cartModel = mongoose.model('carts', cartSchema);