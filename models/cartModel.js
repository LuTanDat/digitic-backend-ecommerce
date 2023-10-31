const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema(
    {
        // products: [
        //     {
        //         product: {
        //             type: mongoose.Schema.Types.ObjectId,
        //             ref: "Product",
        //         },
        //         count: Number,
        //         color: String,
        //         price: Number,
        //     },
        // ],
        // cartTotal: Number, // tong gia goc
        // totalAfterDiscount: Number, // tong gia sau discount
        // orderby: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "User",
        // },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
        quantity: {
            type: Number,
            require: true
        },
        color: {
            type: String,
            require: true
        },
        price: {
            type: Number,
            require: true
        },
        priceAfterDiscount: {
            type: Number,
            require: true
        },
    },
    {
        timestamps: true,
    }
);

//Export the model
module.exports = mongoose.model("Cart", cartSchema);