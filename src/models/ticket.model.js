import mongoose from "mongoose";
import userModel from "./user.model.js";
import cartModel from "./carts.model.js";

const ticketSheman = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: userModel
    },
    code: {
        type: String,
        unique: true,
        ref: Math.random(),
    },
    purchase_datatime: {
        type: String,
        createdAt: Date

    },
    purchaser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: userModel
    },
    amount: {
        type: Number,
        ref: cartModel
    },
})

const ticketModel = mongoose.model('ticket', ticketSheman);
export default ticketModel