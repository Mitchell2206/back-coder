import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    title: String,
    descripcion: String,
    price: Number,
    code: {
        type: String,
        unique: true,
    },
    stock: Number
});


export const userModel = mongoose.model('products', userSchema); 